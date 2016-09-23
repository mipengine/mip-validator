# MIP校验框架

[![NPM version](https://img.shields.io/npm/v/mip-validator.svg?style=flat)](https://www.npmjs.org/package/mip-validator)
[![Build Status](https://travis-ci.org/mipengine/mip-validator.svg?branch=master)](https://travis-ci.org/mipengine/mip-validator)
[![Coverage Status](https://coveralls.io/repos/github/mipengine/mip-validator/badge.svg?branch=master)](https://coveralls.io/github/mipengine/mip-validator?branch=master)
[![Dependency manager](https://img.shields.io/david/dev/mipengine/mip-validator.svg?style=flat)](https://david-dm.org/mipengine/mip-validator)

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

## 编程接口

需要在本地安装`mip-validator`，即安装于`node_modules`目录下。API：

* `new Validator(<rules>)`：根据传入的校验规则返回一个校验器实例，`rules`参数可省略，默认为最新的MIP校验规则。
* `.validate(html)`：传入HTML字符串，返回错误列表（如果完全正确，则返回空数组）。

### 默认使用方式

使用`mip-validator`创建一个实例，即可用来验证MIP HTML。

```javascript
const Validator = require('mip-validator');

var validator = Valicator(); // 等效于：Valicator(Validator.rules);
var errs = validator.validate('<html><div></div></html>')
console.log(errs);
```

### 自定义规则配置

如果你希望使用旧版规则（rules.json），或者希望探索MIP校验框架内部的逻辑，
或者在发明新的校验规则，可以将你的规则作为构造参数传入。

```javascript
var rules = {
    div: {
        mandatory: true
    }
};
var validator = Validator(rules);
```

可通过`Validator.rules`访问最新的MIP的规则，并在其基础上进行定制，例如：

```javascript
var rules = Validator.rules;
rules.div = {
    mandatory: rules.iframe.mandatory
};
var validator = Validator(rules);
```

## 命令行接口

需要全局安装`mip-validator`（见上一节）。API：

* 使用标准输入HTML（String类型）
* 标准输出的错误列表（JSON格式）
* `-c`参数（可选）来指定规则文件（JSON格式），为空则采用MIP默认配置。

例如：

```bash
# 验证 a.html
mip-validator < a.html
# 也可将验证结果重定向至文件
mip-validator < a.html > a.html.json
```

更多参数：

```bash
mip-validator --help
    -h, --help         output usage information
    -V, --version      output the version number
    -c, --conf [path]  validator configuration file [rules.json]
```

## 浏览器JS

MIP校验框架可以在浏览器端使用，通过`window.MIPValidator`提供API。
将`dist/mip-validator.js`引入页面后，在脚本中可直接使用，用法与Node.js端完全相同：

```javascript
// 在浏览器中：
var Validator = window.MIPValidator;
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
