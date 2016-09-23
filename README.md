# MIP校验框架

本项目给出用于MIP校验的NPM软件包，支持编程方式、命令行接口、以及浏览器JS。
本文档介绍MIP校验框架的使用和开发方式，其他相关文档请参考：

* 规则配置语法： <https://github.com/mipengine/mip-validator/wiki/MIP%E8%A7%84%E5%88%99%E8%AF%AD%E6%B3%95>
* 最新规则文件： <https://github.com/mipengine/mip-validator/blob/master/rules.json>
* 错误码与错误提示：<https://github.com/mipengine/mip-validator/blob/master/src/error.json>

## 安装

**确保安装了Node.js(版本>=4)**

```bash
# 编程方式访问
npm install -S mip-validator
# 命令行接口
sudo npm install -g mip-validator
```

注意：对于命令行接口，如果没有管理员权限可安装在本地（不加`-g`参数）：

```bash
npm install mip-validator
```

以后使用时用本地的可执行文件`./node_modules/.bin/mip-validator`代替全局可执行文件`mip-validator`。

## 使用

### 编程接口

需要在本地安装`mip-validator`（见上一节）。API：

* `new Validator([rules])`：根据传入的校验规则返回一个校验器实例。
* `.validate(html)`：传入HTML字符串，返回错误列表（如果完全正确，则返回空数组）。
* `#rules`：默认规则配置。

#### 默认使用方式

使用`mip-validator`创建一个实例，即可用来验证MIP HTML。

```bash
const Validator = require('mip-validator');

var validator = Valicator(); // 等效于：Valicator(Validator.rules);
var errs = validator.validate('<html><div></div></html>')
console.log(errs);
```

#### 自定义规则配置

如需更新验证规则，或者测试新的验证规则，可通过构造参数传入。

```bash
rules = {
    div: {
        mandatory: true
    }
};
var validator = Validator(rules);
// ...
```

### 命令行接口

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
# 命令参数及说明
    -h, --help         output usage information
    -V, --version      output the version number
    -c, --conf [path]  validator configuration file [rules.json]
```

### 浏览器JS


将`dist/mip-validator.js`引入页面后，在脚本中可直接使用：

```javascript
// 在浏览器中：
var Validator = window.MIPValidator;
var validator = Validator(rules);
// 使用方式参考编程接口
```

## 开发

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

[wiki]: http://gitlab.baidu.com/MIP/mip-validator/wikis/rules
