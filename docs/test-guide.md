# 测试用例说明
序号|功能
---|---
1 | 缺少 mip属性, html 缺失 mip
2 | 缺少 head
3 | 缺少 charset
4 | 缺少 meta
5 | 缺少 css
6 | 缺少 body
7 | 缺少 link rel="standardhtml" href=""
  | 
8 | 禁止 frameset，frame
9 | 禁止 frameset，frame
10| 禁止 object
11| 禁止 param
12| 禁止 applet
13| 禁止 embed
14| 禁止 form
15| 禁止 input
16| 禁止 textarea
17| 禁止 select, option
18| 禁止 img
19| 禁止 video
20| 禁止 audio
  | 
21| 属性值无效 a 的 href 为 javascript:void(0)
22| 属性值无效 a 的 target 为 _self
23| 属性值无效 mip-img 的 src 为空
24| 属性值无效 mip-pix 的强制性属性 src 缺失
25| 属性值无效 meta 的 content 的属性 width 为空
26| 属性值无效 mip-img src 属性无效
27| mip-ad  type 缺失
  | 
28| 父标签 head 为 div, 应为html 
29| 父标签 body 为 body, 应为html 
30| 父标签 meta 为 body, 应为head
31| 父标签 link 为 body, 应为head
32| 父标签 style mip-custom 为 body, 应为head
  | 
33| 多个 !DOCTYPE html 被容错
34| 多个 head
35| 多个 meta http-equiv=Content-Type
36| 多个 standhtml
37| 多个 body
  | 
38| mip-video 缺少 src poster
39| mip-carousel 缺少 width height
40| mip-iframe 缺少 width height
41| mip-appdl 缺少 tpl src texttip postiontye
42| mip-audio 缺少 src
43| mip-stats-bidu 缺少 token
44| mip-form 缺少 medth url
45| mip-link 缺少 href
47| mip-embed 缺少 type
48| mipmain js 缺失

