---
layout: post
title: 如何创建 Vagrant BaseBox - CentOS 6.5
description: 在差不多两年前，开发环境对我来说那都不是个事儿，但随着公司的系统越来越复杂，引入的技术越来越多，配置一个在本机运行的开发环境就变得越来越难，直至去年中旬，公司引入了 FastDFS后，彻底粉碎了团队所有人的本机开发环境。就在去年底，我了解到了 Vagrant，于是就和公司的运维小伙伴儿讨论是否可以用这货来做我们的开发环境，主要就是解决配置麻烦且可以运维驱动环境变化的需求。
category: linux
tags: vagrant basebox centos
---

### 测试环境

- 操作系统: Win7 32bit
- VirtualBox: 4.2.18
- CentOS ISO: CentOS-6.5-x86_64-bin-DVD


### 创建虚拟机

- 名称: vagrant-centos-6-5
- 类型: Linux
- 版本: RedHat 64
- 内存: 512M
- 硬盘: 40G
- USB: 关闭
- 声音: 关闭

其它参数默认即可，但我习惯性把软盘给去了。


### 安装系统

没有什么特别说明,只是注意 `root 密码: vagrant`


### 设置环境变量

{% highlight bash %}
export PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
{% endhighlight %}


### 开启网卡

{% highlight bash %}
sed -i 's/ONBOOT=no/ONBOOT=yes/g' /etc/sysconfig/network-scripts/ifcfg-eth0
service network restart
{% endhighlight %}

### 停用 IPV6 和设置 HOSTNAME

{% highlight bash %}
cat > /etc/sysconfig/network << EOF
NETWORKING=yes
NETWORKING_IPV6=no
HOSTNAME=vagrant-centos-6.vagrantup.com
EOF
{% endhighlight %}

### 添加 HOSTS

{% highlight bash %}
echo '127.0.0.1   vagrant-centos-6.vagrantup.com' >> /etc/hosts
{% endhighlight %}

### 设置时区

{% highlight bash %}
rm -rf /etc/localtime
ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
{% endhighlight %}

### 更新系统

{% highlight bash %}
yum -y update
reboot
{% endhighlight %}

更新系统后会安装最新内核，所以最好重启一下，重启完成后，删除旧内核，但在重启完成后，需要再次执行`设置环境变量`操作

{% highlight bash %}
yum -y remove kernel
{% endhighlight %}

### 关闭防火墙

{% highlight bash %}
service iptables stop
chkconfig --level 35 iptables off
service ip6tables stop
chkconfig --level 35 ip6tables off
{% endhighlight %}

### 关闭 SELinux

{% highlight bash %}
setenforce 0
sed -i 's/^SELINUX=.*$/SELINUX=disabled/' /etc/selinux/config
{% endhighlight %}

### 创建 vagrant 用户

{% highlight bash %}
groupadd vagrant
adduser -g vagrant vagrant
echo "vagrant" | passwd --stdin vagrant
{% endhighlight %}

### 安装 sudo

{% highlight bash %}
yum -y install sudo
{% endhighlight %}

### 设置 vagrant 用户 sudoer

{% highlight bash %}
cat << EOF > /etc/sudoers.d/vagrant
Defaults:%vagrant env_keep += "SSH_AUTH_SOCK"
Defaults:%vagrant !requiretty
%vagrant ALL=NOPASSWD: ALL
EOF

chmod 0440 /etc/sudoers.d/vagrant
{% endhighlight %}

### 设置 Vagrant SSH-KEY

{% highlight bash %}
mkdir /home/vagrant/.ssh
chmod 0700 /home/vagrant/.ssh
curl -o /home/vagrant/.ssh/id_rsa https://raw.github.com/mitchellh/vagrant/master/keys/vagrant
curl -o /home/vagrant/.ssh/authorized_keys https://raw.github.com/mitchellh/vagrant/master/keys/vagrant.pub
chown -R vagrant:vagrant /home/vagrant/.ssh
chmod 0600 /home/vagrant/.ssh/*
echo 'UseDNS no' >> /etc/ssh/sshd_config
{% endhighlight %}

### 安装 VBoxLinuxAdditions

#### 安装必备包

{% highlight bash %}
yum -y install gcc make kernel-devel kernel-headers bzip2 perl
{% endhighlight %}

#### 设置当前内核环境变量

{% highlight bash %}
KERN_DIR=/usr/src/kernels/`uname -r`
export KERN_DIR
{% endhighlight %}

#### 安装 EPEL repo

{% highlight bash %}
rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
{% endhighlight %}

#### 安装依赖库

{% highlight bash %}
yum -y install dkms
{% endhighlight %}

装载增强功能光盘，设备 > 安装增强功能...

{% highlight bash %}
mkdir /media/VirtualBoxGuestAdditions
mount -r /dev/cdrom /media/VirtualBoxGuestAdditions
{% endhighlight %}

#### 开始安装

{% highlight bash %}
/media/VirtualBoxGuestAdditions/VBoxLinuxAdditions.run
{% endhighlight %}

#### 结束安装

{% highlight bash %}
umount /media/VirtualBoxGuestAdditions
rmdir /media/VirtualBoxGuestAdditions
{% endhighlight %}

### 安装配置管理软件

根据你的需要安装需要的配置管理软件

{% highlight bash %}
yum -y install rubygems ruby-devel
{% endhighlight %}

#### 安装 Puppet

{% highlight bash %}
gem install --no-ri --no-rdoc puppet
{% endhighlight %}

#### 安装 Chef

{% highlight bash %}
gem install --no-ri --no-rdoc chef
{% endhighlight %}

#### 直接使用 Shell 方式部署

貌似是依赖 `scp` 所以把它装上就行了

{% highlight bash %}
yum -y install openssh-clients
{% endhighlight %}

### 扎手尾

{% highlight bash %}
yum -y clean all
swapoff -a
mkswap /dev/mapper/vg_vagrantcentos-lv_swap
dd if=/dev/zero of=/boot/EMPTY bs=1M
rm -f /boot/EMPTY
dd if=/dev/zero of=/EMPTY bs=1M
rm -f /EMPTY
{% endhighlight %}

### 打包 BaseBox

{% highlight bash %}
vagrant package --base "vagrant-centos-6-5" --output "vagrant-centos-6-5.box"
{% endhighlight %}

### 接下来...

> 本想折腾 Puppet，考虑到实际情况，所以还是改为使用 Shell 吧

### Changelogs

- 2014/1/8
    - 修复配置 vagrant .ssh 目录权限时的错误
    - 添加 Shell Provisioner 配置
