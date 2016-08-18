# MIP校验框架和命令行工具

本项目给出用于MIP校验的NPM软件包，支持编程方式和命令行两种接口。
本文档介绍两种接口的使用和开发方式，如需了解规则配置框架请移步：

<http://gitlab.baidu.com/MIP/mip-validator/tree/master/docs/rules.md>

## 安装

```bash
# 编程方式访问
npm install -S mip-validator
# 命令行接口
npm install -g mip-validator
```

## 使用

### 编程接口

需要在本地安装`mip-validator`（见上一节）。API：

* `new Validator(rules)`：根据传入的校验规则返回一个校验器实例。
* `.validate(html)`：传入HTML字符串，返回错误列表（如果完全正确，则返回空数组）。

```bash
const Validator = require('mip-validator');
var validator = Valicator({
    div: {
        mandatory: true
    }
});
var errorArray = validator.validate('<html><div></div></html>')
console.log(errorArray);
```

### 命令行接口

需要全局安装`mip-validator`（见上一节）。API：

* `-f`参数来指定规则文件（JSON格式），默认为`./validator.json`。
* 使用标准输入HTML（String类型）
* 标准输出的错误列表（JSON格式）

例如：

```bash
mip-validator -f conf.json < a.html > result.json
```

更多使用方式请参考：

```bash
mip-validator --help
```

## 规则配置

`mip-validator`使用JSON格式的规则配置，详情请查看[wiki][wiki]。
仓库中提供了一组示例：

* `examples/conf.json`：示例规则配置文件
* `examples/valid.html`：合法的HTML，满足上述规则配置
* `examples/valid.html.json`：上述文件的校验结果
* `examples/invalid.html`：不合法的HTML，不满足上述规则配置
* `examples/invalid.html.json`：上述文件的校验结果

## 开发

### 环境准备

确保安装了Node.js(>=4)，然后克隆仓库并安装依赖。

```bash
git clone xxx
npm install
```

### 测试

可以使用NPM Script进行测试，也可以全局安装`mocha`后直接运行Mocha。

```bash
# 使用NPM Script
npm test

# 或者直接运行（需要安装mocha）：
mocha
```

### 校验样例HTML

利用Makefile可以方便地校验`example`下的样例文件，其中：

* `example/conf.json`: 校验配置文件
* `example/valid.html`: 样例HTML（符合上述校验配置）
* `example/invalid.html`: 样例HTML（不符合上述校验配置）

```bash
# 校验符合规则的HTML
make valid
# 校验不符合规则的HTML
make invalid
```

[wiki]: http://gitlab.baidu.com/MIP/mip-validator/wikis/rules
