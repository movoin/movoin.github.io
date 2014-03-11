---
layout: post
title: 如何在 CentOS 6.5 中安装 Antiword 和 Pdftotext
description: 近期要完成一个需求，需要从 Doc, Docx, PDF, Txt, Html 中导入特定的内容。哎，以前没折腾过，只知道怎么生成，哪里会想到从里面导数据啊。网上搜索呗，这时候就可以发现百度真心不给力啊，还是 Google 好，第一页就可以找到我需要的内容，至少我知道怎么处理 Doc, Docx 和 PDF了，Txt 还有 Html 那都不是事儿。
category: linux
tags: blog
---

### Antiword

> [Antiword](http://www.winfield.demon.nl) 是一个跨平台的 Word 文档的开源阅读器。 [Antiword](http://www.winfield.demon.nl) 可以将文件从 Word 2，6，7，97，2000，2002 和 2003 转为纯文本，并提供解析 PDF，PostScript，XML/DocBook（实验）的功能。

#### 参数说明

> 直接照本宣科好了，因为参数就那么些个，复杂的我也用不上，最多我也就是加个 `-w`

    Usage: antiword [switches] wordfile1 [wordfile2 ...]
    Switches: [-f|-t|-a papersize|-p papersize|-x dtd][-m mapping][-w #][-i #][-Ls]
        -f formatted text output
        -t text output (default)
        -a <paper size name> Adobe PDF output
        -p <paper size name> PostScript output
           paper size like: a4, letter or legal
        -x <dtd> XML output
           like: db (DocBook)
        -m <mapping> character mapping file
        -w <width> in characters of text output
        -i <level> image level (PostScript only)
        -L use landscape mode (PostScript only)
        -r Show removed text
        -s Show hidden (by Word) text


#### 开始安装

[Antiword](http://www.winfield.demon.nl) 网站上提供的 RPM 会提示一个 so 文件不存在，哎~懒得去折腾。更别想让我编译安装了，于是我抱着试一下的态度装上了 [RPMForge](http://repoforge.org/)，因为按照一般的逻辑，默认仓库中没有的在它上面都能够找得到，果不其然！

我的环境是 CentOS 6.5 x86_64，所以下载的是对应版本的 RPM.

{% highlight bash %}
rpm -ivh http://pkgs.repoforge.org/rpmforge-release/rpmforge-release-0.5.3-1.el6.rf.x86_64.rpm
yum -y install antiword
{% endhighlight %}


#### 使用示例

{% highlight bash %}
antiword -w 500 test.doc
{% endhighlight %}


### pdftotext

> [pdftotext](http://linuxappfinder.com/package/poppler-utils) 是一个开源的命令行工具，可以将 PDF 文件转换为纯文本文件。`这个工具我也就知道这么点儿了`

#### 参数说明

    Usage: pdftotext [options] <PDF-file> [<text-file>]
      -f <int>          : first page to convert
      -l <int>          : last page to convert
      -r <fp>           : resolution, in DPI (default is 72)
      -x <int>          : x-coordinate of the crop area top left corner
      -y <int>          : y-coordinate of the crop area top left corner
      -W <int>          : width of crop area in pixels (default is 0)
      -H <int>          : height of crop area in pixels (default is 0)
      -layout           : maintain original physical layout
      -raw              : keep strings in content stream order
      -htmlmeta         : generate a simple HTML file, including the meta information
      -enc <string>     : output text encoding name
      -listenc          : list available encodings
      -eol <string>     : output end-of-line convention (unix, dos, or mac)
      -nopgbrk          : don't insert page breaks between pages
      -opw <string>     : owner password (for encrypted files)
      -upw <string>     : user password (for encrypted files)
      -q                : don't print any messages or errors
      -v                : print copyright and version info
      -h                : print usage information
      -help             : print usage information
      --help            : print usage information
      -?                : print usage information

#### 开始安装

因为我已经安装了 [RPMForge](http://repoforge.org/) 所以我不确定是否系统默认包含，如果安装提示不存在，那就参照上面的方法先安装 [RPMForge](http://repoforge.org/) 吧。

[pdftotext](http://linuxappfinder.com/package/poppler-utils) 包含在 `poppler-utils` 这个包中，安装它即安装好了。

{% highlight bash %}
yum -y install poppler-utils
{% endhighlight %}

#### 使用示例

_注意后面的_ `-`, _不然它会生成一个同名的 txt 文件_

{% highlight bash %}
pdftotext -layout test.pdf -
{% endhighlight %}
