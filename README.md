# MIP Validator

[![NPM version](https://img.shields.io/npm/v/mip-validator.svg?style=flat)](https://www.npmjs.org/package/mip-validator)
<!--
[![Build Status](https://travis-ci.org/mipengine/mip-validator.svg?branch=master)](https://travis-ci.org/mipengine/mip-validator)
[![Coverage Status](https://coveralls.io/repos/github/mipengine/mip-validator/badge.svg?branch=master)](https://coveralls.io/github/mipengine/mip-validator?branch=master)
-->
[![Dependency manager](https://david-dm.org/mipengine/mip-validator/status.svg)](https://david-dm.org/mipengine/mip-validator)

本项目给出用于MIP校验的NPM软件包，支持编程方式、命令行接口、以及浏览器JS。
本文档介绍MIP校验框架的使用和开发方式，其他相关文档请参考[Wiki][wiki]。

## 依赖与安装

确保安装了Node.js(版本>=4)，然后使用npm安装`mip-validator`。

```bash
# 编程方式访问，将会安装到 ./node_modules/mip-validator
npm install -S mip-validator
# 命令行接口
sudo npm install -g mip-validator
```

注意：对于命令行接口，如果没有管理员权限可安装在本地（不加`-g`参数）：

```bash
npm install mip-validator
```

以后使用时用本地的可执行文件`./node_modules/.bin/mip-validator`代替全局可执行文件`mip-validator`。

## 使用方式

### 编程接口

在本地安装`mip-validator`（即安装于`node_modules`目录下）。
使用`mip-validator`创建一个实例，即可用来验证MIP HTML。

```javascript
const Validator = require('mip-validator');

// 使用默认规则创建实例，等效于：Valicator(Validator.rules);
var validator = Valicator(); 
var errs = validator.validate('<html><div></div></html>')
console.log(errs);
```

### 命令行接口

需要全局安装`mip-validator`（见上一节）。API：

* 使用标准输入HTML（String类型）
* 标准输出的错误列表（JSON格式）
* `-c`参数（可选）来指定规则文件（JSON格式），为空则采用MIP默认配置。

例如：

```
$ mip-validator < a.html                # 校验 a.html
$ mip-validator < a.html > a.html.json  # 也可将验证结果重定向至文件
$ mip-validator --help                  # 查看帮助
    -h, --help         output usage information
    -V, --version      output the version number
    -F, --fast         fast validation
    -c, --conf [path]  validator configuration file [rules.json]
```

### 浏览器JS

MIP校验框架可以在浏览器端使用，通过`window.MIPValidator`提供API。
将`dist/mip-validator.js`引入页面后，在页面脚本中可直接使用，用法与Node.js端完全相同：

```javascript
var Validator = window.MIPValidator;
var validator = Validator();
```

### HTTP Service

```
$ mip-validator-http
```

> 端口与主机可以通过参数更改，更多信息请运行`mip-validator-http -h`。

然后访问`http://localhost:4444`，可以看到简单的使用说明。
示例客户端程序见：[demo/http.js](demo/http.js)。

* 校验HTML文档：POST `/validate`，Request Body为待校验HTML字符串。
* 快速校验HTML文档：POST `/validate?fast=true`，Request Body为待校验HTML字符串。

> 开启快速校验时，只能获得第一个校验错误。因此运行也稍快。

### Socket Service

Socket服务只支持快速校验模式，不需要设置。

```
$ mip-validator-socket
```

创建Socket Client并连接到`localhost:4445`，逐个发送HTML。
HTML文本之间以`__baidu_mip_validator__`分隔，
返回的字符串也以`__baidu_mip_validator__`分隔。
对于每个HTML，将按顺序返回一个字符串序列化的JSON。
示例客户端程序见：[demo/socket.js](demo/socket.js)。

* 统一使用UTF-8编码。
* 协议仍待增强（字符串Escape未实现）。

> 端口与主机可以通过参数更改，更多信息请运行`mip-validator-socket -h`。

## API

### `new Validator(<rules>, <config>)`

根据传入的校验规则，以及校验器配置返回一个校验器实例。

### `<rules>`

可选，默认值：`Validator.rules`。

> 默认值的内容见[rules.json](rules.json)，语法见[rules wiki][rules-syntax]。

为`false`, `undefined`, `null`时会应用默认值，
为Object（例如`{}`）时会应用该规则定义对象。
如果你希望使用旧版规则（rules.json），或者希望探索MIP校验框架内部的逻辑，
或者在发明新的校验规则，可以使用此参数。

```javascript
var rules = {
    div: {
        mandatory: true
    }
};
var validator = Validator(rules);
```

### `<config.fast>`

可选，默认值：`false`

为`true`时mip-validator在第一个错误发生就立即返回。
否则mip-validator会找到所有错误。例如：

```javascript
var validator = Validator(null, {fast: true});
```

### `.validate(html)`

传入HTML字符串，返回错误列表（如果完全正确，则返回空数组）。

### `Validator.rules`

默认的MIP校验规则（`<rules>`的默认值），可在其基础上进行定制，例如：

```javascript
var rules = Validator.rules;
rules.div = {
    mandatory: rules.iframe.mandatory
};
var validator = Validator(rules);
```

## 开发指南

### 环境准备

确保安装了Node.js(>=4)，然后克隆仓库并安装依赖。

```bash
git clone xxx
npm install
```

### 单元测试

可以使用NPM Script进行测试，也可以全局安装`mocha`后直接运行Mocha。

```bash
# 使用NPM Script
npm test

# 或者直接运行（需要安装mocha）：
mocha
```

### 集成测试

目前利用Makefile可以方便地校验`example`下的样例文件，其中：

* `example/htmls/*.html`: 样例HTML
* `example/results/*.html.json`: 对应样例HTML的校验结果

校验所有`example/htmls`下的HTML文件（结果会输出到`examples/results/`）：

```bash
make examples
```

TODO: 自动运行集成测试，并给出DIFF。

### 构建浏览器JS

mip-validator依赖于Node.js 4以上，
但本项目通过Browserify提供了在浏览器JS。
可通过下列命令重新生成：

```bash
# 输出到 dist/ 目录：mip-validator.min.js, mip-validator.js
make dist
```

### 工具脚本

工具脚本位于[bin](bin)目录下：

#### bin/cli.js

命令行接口，通过package.json暴露给NPM。

#### bin/benchmark.js

简单的性能测试，运行[examples/htmls](examples/htmls)下的所有样例，
并统计运行时间。使用方式：

```bash
node bin/benchmark.js
```

#### bin/md-error.js

将[错误代码](src/error.json)转换为Markdown文件，用于Wiki或其他Doc。

[wiki]: https://github.com/mipengine/mip-validator/wiki
[rules-syntax]: https://github.com/mipengine/mip-validator/wiki/%E8%A7%84%E5%88%99%E9%85%8D%E7%BD%AE%E8%AF%AD%E6%B3%95
