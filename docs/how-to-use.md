# mip 校验工具使用说明

## 命令行工具

### 安装

**确保安装了Node.js(版本>=4)**

```
	# 全局安装校验工具
	npm install -g mip-validator
```

### 使用

#### 命令参数说明

```
	# 查看所有参数
    mip-validator --help

    # 命令参数及说明
    -h, --help         output usage information
    -V, --version      output the version number
    -c, --conf [path]  validator configuration file [validator.json]
```

#### 如何验证

假设本地有 valid.html 和 invalid.html 两个html页面。本地验证页面的命令为：

```
	# 验证结果输出到命令行(验证valid.html)
	mip-validator < valid.html

	# 验证结果输出到指定文件(验证invalid.html)
	mip-validator < invalid.html > invalid.html.json
```

#### 示例

- valid.html 页面的源代码为：

```
<!DOCTYPE html>
<html mip>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <title>MIP DEMO</title>
    <link rel="stylesheet" href="https://mipcache.bdstatic.com/static/mip-common.css">
    <link rel="standardhtml" href="页面h5 url">
    <noscript>
        <style mip-officialrelease>
            body {
                -webkit-animation: none;
                   -moz-animation: none;
                    -ms-animation: none;
                        animation: none
            }
        </style>
  </noscript>
</head>

<body>
    <p class="mip-text">这是一个段落，纯文本形式</p>
    
    <div class="mip-img-container">
        <mip-img data-carousel="carousel" class="mip-element mip-img" src="//m.baidu.com/static/index/plus/plus_logo.png">
            <p class="mip-img-subtitle">带图片标题的类型</p>
        </mip-img>
    </div>
    
    <div class="mip-adbd">
        <mip-embed type="ad-baidu" cproid="u2697394"></mip-embed>
    </div>

    <script src="https://mipcache.bdstatic.com/static/mipmain-v1.0.0.js"></script>
    <script src="https://mipcache.bdstatic.com/static/v1.0/mip-ad.js"></script>
</body>
</html>
```

- 验证结果

```
$ mip-validator < valid.html
[]
```

- invalid.html 页面的源代码为：

```
<!DOCTYPE html>
<html mip>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <title>MIP DEMO</title>
    <link rel="stylesheet" href="https://mipcache.bdstatic.com/static/mip-common.css">
    <link rel="standardhtml" href="页面h5 url">
    <noscript>
        <style mip-officialrelease>
            body {
                -webkit-animation: none;
                   -moz-animation: none;
                    -ms-animation: none;
                        animation: none
            }
        </style>
  </noscript>
</head>

<body>
    <p class="mip-text">这是一个段落，纯文本形式</p>
    
    <div class="mip-img-container">
        <mip-img data-carousel="carousel" class="mip-element mip-img" src="//m.baidu.com/static/index/plus/plus_logo.png">
            <p class="mip-img-subtitle">带图片标题的类型</p>
        </mip-img>
    </div>
    
    <div class="mip-adbd">
        <mip-embed type="ad-baidu" cproid="u2697394"></mip-embed>
    </div>

    <script src="https://mipcache.bdstatic.com/static/v1.0/mip-ad.js"></script>
</body>
</html>
```

- 验证结果

```
$ mip-validator < invalid.html
[
    {
        "code": "06200101",
        "message": "强制性标签'<script type=\"/^(text/javascript)?/\" src=\"/^(http(s)?:)?//(mipcache.bdstatic.com/static/mipmain)|(m.baidu.com/static/ala/sf/static/)/\">'缺失或错误",
        "line": 0,
        "col": 0,
        "offset": 0,
        "input": ""
    }
]
```

## 页面校验工具

校验工具地址


