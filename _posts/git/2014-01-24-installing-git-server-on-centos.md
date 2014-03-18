---
layout: post
title: 安装 Git Server - CentOS 6.5
description: 其实很早以前我就配置过 Git Server，但一直卡在不断提示输入密码的问题上面，今天无意中看到了 ~/.ssh/config 文件中的内容，让我顿悟了，原来是酱紫的！
category: git
tags: blog
---


### 准备环境

- **服务器**: CentOS 6.5 x86_64
- **服务器 Domain**: git.devbox.com
- **工作机**: Win7 64bit
- **SSH 终端**: XShell
- **登录用户**: root


### 安装 GIT && Gitosis

**执行位置** -> `服务器`

```bash
yum -y install git python-setuptools

cd /usr/local/src/
git clone https://github.com/res0nat0r/gitosis.git
cd ./gitosis/
python setup.py install
```

### 添加用户

**执行位置** -> `服务器`

添加用户后不设置用户密码。

```bash
useradd \
      -r \
      -s /bin/sh \
      -c 'git version control' \
      -d /home/git \
      git

mkdir -p /home/git

chown git:git /home/git
```

### 创建 gitosis 管理员密钥

**执行位置** -> `开发机`

在开发机需要安装好 Git，安装后就可以使用以下命令创建密钥。

> 切换目录至 `<USER>/.ssh/` 即你的用户目录。

```bash
ssh-keygen -t rsa

Generating public/private rsa key pair.
Enter file in which to save the key (//.ssh/id_rsa):
```

建议使用 `<name>_rsa` 作为文件名，如：`allen_rsa`
密钥为空或你指定的密码，我使用空密码

#### 复制 PUB 文件

从 `开发机` 复制到 `服务器`，XShell 可以方便的使用 ZMODEM 发送文件，所以我直接使用此方法复制文件。

要使用 ZMODEM 需要在服务器安装一个包 `lrzsz`

**执行位置** -> `服务器`

```bash
yum -y install lrzsz
```

安装好后，切换当前文件夹至 `/tmp`，然后在 XShell 中单击 `右键`，选择 `传输` -> `用 ZMODEM 发送`，选择 `<USER>/.ssh/` 目录中你创建的 `<name>_rsa.pub`


### 初始化 gitosis 服务

**执行位置** -> `服务器`

```bash
su git
cd ~
gitosis-init < /tmp/<name>_rsa.pub

Initialized empty Git repository in /home/git/repositories/gitosis-admin.git/
Reinitialized existing Git repository in /home/git/repositories/gitosis-admin.git/
```

### 初始化 gitosis-admin

**执行位置** -> `开发机`

进入 `<USER>/.ssh/` 目录，编辑 config 文件 (如果没有可自行创建)，添加以下内容：

Host 是 Git Server 的域名, 也可以是 IP。

```
Host git.devbox.com
 IdentityFile ~/.ssh/<name>_rsa
```

> 我不清楚是否有人和我一样在最初尝试的时候，被无情的卡在了这一步，抓狂般的看着那一次次的密码输入提醒，心想：“为毛要我输入密码？我的 git 用户都没有设置密码呀！”。

虽然现在我解决了这个问题，但仍然不甚了解，只是简单的以为，默认提交的身份认证文件和 `gitosis-admin` 中的不一致，所以需要指定一下 `IdentityFile`。

#### 克隆 gitosis-admin

**执行位置** -> `开发机`

进入任何目录，如：`E:\workspace`，将 `gitosis-admin` 克隆下来。

_建议使用 `Git Bash` 执行这一步。_

```bash
git clone git@git.devbox.com:gitosis-admin.git

Cloning into 'gitosis-admin'...
remote: Counting objects: 5, done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 5 (delta 0), reused 5 (delta 0)
Receiving objects: 100% (5/5), done.
```

_关于域名访问的部分，如果本机环境依然想要使用域名访问，可以设置 `hosts` 文件来实现_

### 添加新项目

**执行位置** -> `开发机`

进入 `gitosis-admin` 项目目录， 编辑 `gitosis.conf` 文件，按以下格式添加内容至文件尾部。

```ini
[group groupname1]
writable = project1
members = <username>
```

> - `<username>` 可以参照 `gitosis-admin/keydir` 目录中的 pub 文件名。
> - `groupname` 和 `projectname` 可以根据自己的实际情况来填写。


#### 将修改内容提交至 Git Server

**执行位置** -> `开发机`

```bash
git add -A
git commit -m 'create new git project'
git push origin master
```

注意，经过提交后的设置才会生效！


#### 导入项目代码

**执行位置** -> `开发机`

创建任意目录，如：`project1`，并在目录中创建一个 `README.md` 文件。

```bash
git init
git add .
git commit -m 'hello git'
git remote add origin git@git.devbox.com:project1.git
git push origin master

Initialized empty Git repository in /home/git/repositories/project1.git/
Counting objects: 3, done.
Writing objects: 100% (3/3), 207 bytes | 0 bytes/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To git@git.devbox.com:project1.git
 * [new branch]      master -> master
```


### 添加新成员公钥

让新成员在他的开发机参照 `创建 gitosis 管理员密钥` 步骤生成公钥文件。
并根据实际情况是否执行设置 `~/.ssh/config` 的步骤。
完成后，将生成的公钥文件重命名为 pub 文件内容 `==` 后面的名字，如：`ALLEN@Local.pub`，并将文件发于管理员（你）。


**执行位置** -> `开发机`

进入 `gitosis-admin/keydir`，将收到的公钥文件复制粘贴到此目录中，并提交至 Git Server。

```bash
cd gitosis-admin/keydir/
# Copy and parse
git add -A
git commit -m 'add new member -> allen'
git push origin master
```

设置成员的权限，请参照 `添加新项目`


