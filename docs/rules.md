校验框架的安装和使用方法请参考README，示例校验文件与校验结果请查看 <http://gitlab.baidu.com/MIP/mip-validator/tree/master/examples>。

`mip-validator`采取JSON格式的配置文件，所有校验规则均来源于该文件。
文件的每个根键对应DOM标签名，其属性为应用于该标签的校验规则。
本文档只给出错误代号，对应的错误代码与错误信息请查看：
<http://gitlab.baidu.com/MIP/mip-validator/blob/master/src/error.json>

> `mip-validator`使用parse5作为DOM树解析工具，
> HTML语法错误已被容错。因而语法相关的配置无效。

# Mandatory Tag Missing

属性：`<TagName>.mandatory`

类型：`Boolean`或`<Object>`或`Array<Object>`

默认：`false`

错误代号：`"MANDATORY_TAG_MISSING"`

该字段用来指定强制包含的元素：

* 当该字段为`true`时，HTML必须包含该标签，为`false`则相当于不设置；
* 当该字段为对象时，HTML必须包含属性匹配该对象的标签；
* 当该字段为数组时，HTML必须包含匹配该数组每一项的标签。

例如`<link rel="miphtml">`与`<link rel="standardhtml">`都必须出现可以写成：

```json
{
    "link": {
        "mandatory": [{
            "rel": "^standardhtml$"
        }, {
            "rel": "^miphtml$"
        }]
    }
}
```

# Mandatory Tag Ancestor

属性：`<TagName>.mandatory_ancestor`

类型：`String`

默认：`undefined`

错误代号：`"MANDATORY_TAG_ANCESTOR"`

该字段用来指定一个标签必须拥有的祖先标签。例如`<mip-input>`一定要位于`<mip-form>`下：

```json
{
    "mip-input": {
        "mandatory_ancestor": "mip-form"
    }
}
```

# Mandatory Tag Parent

属性：`<TagName>.mandatory_parent`

类型：`String`

默认：`undefined`

错误代号：`"WRONG_PARENT_TAG"`

该字段用来指定强制父标签。例如：

```json
{
    "head": {
        "mandatory_parent": "html"
    }
}
```

# Disallowed <TagName>

属性：`<TagName>.disallow`

类型：`Boolean`

默认：`false`

错误代号：`"DISALLOWED_TAG"`

为`true`表示该标签不允许在HTML中出现，否则为允许出现。例如不允许`<img>`标签出现：

```json
{
    "img": {
        "disallow": true
    }
}
```

# Disallowed <TagName> Ancestor

属性：`<TagName>.disallowed_ancestor`

类型：`String`或`Array<String>`

默认：`undefined`

错误代号：`"DISALLOWED_TAG_ANCESTOR"`

该字段设置不允许出现的祖先标签，可以是单个标签名，也可以是标签名数组。
例如：

```json
{
    "div": {
        "disallowed_ancestor": "span"
    }, 
    "form":{
        "disallowed_ancestor": ["span", "a"]
    }
}
```

# Duplicate Unique <TagName>

属性：`<TagName>.duplicate`

类型：`Object`或`Array<Object>`

默认：`undefined`

错误代号：`"DUPLICATE_UNIQUE_TAG"`

该属性设置一个或一组模式，符合该模式的标签不可重复，属性值采用正则表达式来书写。
如果是一个模式，则完全匹配该模式的标签不可重复，如果是多个模式则分别不可重复。
例如：

```json
{
    "meta": {
        "duplicate": {
            "viewport": "^.*$"
        }
    "link": {
        "duplicate": [{
            "rel": "^miphtml$"
        }, {
            "rel": "^standardhtml$"
        }]
    }
}
```

# Invalid Attribute Value

属性：`<TagName>.attrs.<AttrName>.value`

类型：`String`

默认：`""`

错误代号：`"INVALID_ATTR_VALUE"`

该字段用来校验属性值是否合法。传入的字符串将被用来构建使用正则表达式。
例如：

```json
{
    "mip-img": {
        "attrs": {
            "src": {
                "value": "^http://"
            }
        }
    }
}
```

# Invalid Property Value in Attribute Value

属性：`<TagName>.attrs.<AttrName>.properties`

类型：`Object`

默认：`undefined`

错误代号：`"INVALID_PROPERTY_VALUE_IN_ATTR_VALUE"`

该字段用来配置attribute值中的property是否拥有合法的值。
该字段生效的前提是同一对象下的`<TagName>.attrs.<AttrName>.match`与当前标签匹配。
例如：

```json
{
    "meta": {
        "attrs": {
            "content" {
                "match": "name=viewport",
                "properties": {
                    "width": "device-width",
                    "initial-scale": "1"
                }
            }
        }
    }
}
```

上述规则将会对所有`<meta name="viewport">`进行校验，验证`content`中的属性是否合法。
比如`<meta name="viewport" content="width=device-width,initial-scale=1">`是合法的。

# Mandatory One of Attribute Missing

属性：`<TagName>.attrs.<AttrName>.mandatory`

类型：`Boolean`

默认：`false`

错误代号：`"MANDATORY_ONEOF_ATTR_MISSING"`

该字段用来指定标签的某个属性是强制包含的。例如：

```json
{
    "mip-input": {
        "attrs": {
            "name": {
                "mandatory": true
            }
        }
    }
}
```

上述规则强制要求所有`<mip-input>`标签拥有`name`属性。


