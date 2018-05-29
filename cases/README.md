# 测试案例对应错误说明

页面编码|说明
---|---
0~50|正确
101|禁止使用`<img>`标签
102|禁止使用`<video>`标签
103|强制性标签`<head>`缺失或错误
104|禁止使用`<audio>`标签
105|标签'a'中的属性'href'的属性值'javascript:void(0)'无效
106|标签'a'中的属性'target'的属性值'_self'无效
107|标签'mip-img'中的属性'src'的属性值''无效
108|标签'mip-pix'的强制性属性'src'缺失
109|标签'meta'中的属性'content'的属性'width'被设置为''，该属性值无效
111|强制标签`<meta charset="utf-8">`缺失
110|标签'mip-img'中的属性'src'的属性值''无效
112|标签'html'的强制性属性'mip'缺失
113|禁止使用`<object>`标签
114|禁止使用`<param>`标签
115|禁止使用`<applet>`标签
116|禁止使用`<embed>`标签
117|禁止使用`<form>`标签
118|标签'input'只能是标签'mip-form'的子级标签
119|标签'textarea'只能是标签'mip-form'的子级标签
120|禁止使用`<select>`,`<option>`标签
121|标签`<link rel=\"/^(miphtml)|(standardhtml)$/\">`只能出现一次
122|标签'body'只能出现一次
123|标签'mip-video'的强制性属性'src'缺失
124|标签'mip-carousel'的强制性属性'width','height'缺失
125|强制性标签`<meta name=\"/^(viewport)?/\" content=\"/(width=device-width)|(initial-scale=1)|(minimum-scale=1){3}(,)?/\">`缺失或错误
126|标签'mip-iframe'的强制性属性'width','height'缺失
127|标签'mip-appdl'的强制性属性'tpl','src','texttip'缺失
128|标签'mip-audio'的强制性属性'src'缺失
129|标签'mip-stats-bidu'的强制性属性'token'缺失
130|标签'mip-form'的强制性属性'method','url'缺失
131|标签'mip-link'的强制性属性'href'缺失
132|禁止使用`<script type=\"text/javascript\">`,`<script type=\"application\">`标签
133|标签'mip-embed'的强制性属性'type'缺失
134|强制性标签`<script src='mip.js'>`缺失
135|`<div>`标签中禁止使用'style'属性
136|强制性标签`<link href='mip.css'>`缺失
137|`<div>`标签中禁止使用'onclick'属性
138|标签'mip-img'中的属性'src'的属性值'/dfdf'无效『/开头的路径禁止使用』
139|标签'mip-ad'的强制性属性'type'缺失
140|标签'head'只能出现一次『head父级错误』
141|标签'body'只能出现一次『body父级错误』
142|标签'mip-link'中的属性'href'的属性值'tel:-'无效，标签'a'中的属性'href'的属性值'tel:13ddff'无效
143|强制性标签`<body>`缺失或错误
144|禁止使用`<script src=\"./bn_files/ds.js\">`标签,强制性标签`<link rel="canonical">`缺失或错误
145|禁止使用`<frame>`,`<frameset>`标签
146|禁止使用`<frame>`,`<frameset>`,`<script>`标签
147|标签'meta'的直接父标签应该是'head'，而不是'body'
148|标签'link'的直接父标签应该是'head'，而不是'body'
149|标签'style'的直接父标签应该是'head'，而不是'body'
150|标签'head'只能出现一次
151|标签`<meta http-equiv=\"/Content-Type/i\">`只能出现一次
152|标签`<noscript>`在标签`<head>`中时强制为最后一个子节点
153|template中有img
154|template中有video
155|template中有head
156|template中有audio
157|template中：标签'a'中的属性'href'的属性值'javascript:void(0)'无效
158|template中：标签'a'中的属性'target'的属性值'_self'无效
159|template中：标签'mip-img'中的属性'src'的属性值''无效
160|template中：标签'mip-pix'的强制性属性'src'缺失
161|template中：标签'meta'中的属性'content'的属性'width'被设置为''，该属性值无效
162|template中：template中：标签'head'只能出现一次
163|template中：标签`<meta http-equiv=\"/Content-Type/i\">`只能出现一次
164|template中：标签'html'只能出现一次
165|template中：禁止使用`<object>`标签
166|template中：禁止使用`<param>`标签
167|template中：禁止使用`<applet>`标签
168|template中：禁止使用`<embed>`标签
169|template中：禁止使用`<form>`标签
170|template中：标签'input'只能是标签'mip-form'的子级标签
171|template中：标签'textarea'只能是标签'mip-form'的子级标签
172|template中：禁止使用`<select>`,`<option>`标签
173|template中：标签`<link rel=\"/^(miphtml)|(standardhtml)$/\">`只能出现一次
174|template中：标签'body'只能出现一次
175|template中：标签'mip-video'的强制性属性'src'缺失
176|template中：标签'mip-carousel'的强制性属性'width','height'缺失
177|template中：存在`<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">`
178|template中：标签'mip-iframe'的强制性属性'width','height'缺失
179|template中：标签'mip-appdl'的强制性属性'tpl','src','texttip'缺失
180|template中：标签'mip-audio'的强制性属性'src'缺失
181|template中：标签'mip-stats-bidu'的强制性属性'token'缺失
182|template中：标签'mip-form'的强制性属性'method','url'缺失
183|标签'mip-link'的强制性属性'href'缺失
184|template中：禁止使用`<script type=\"text/javascript\">`,`<script type=\"application\">`标签
185|template中：标签'mip-embed'的强制性属性'type'缺失
186|template中：强制性标签`<script src='mip.js'>`缺失
187|template中：`<div>`标签中禁止使用'style'属性
188|template中：强制性标签`<link href='mip.css'>`缺失
189|template中：`<div>`标签中禁止使用'onclick'属性
190|template中：标签'mip-img'中的属性'src'的属性值'/dfdf'无效『/开头的路径禁止使用』
191|template中：标签'mip-ad'的强制性属性'type'缺失
192|template中：标签'head'只能出现一次『head父级错误』
193|template中：标签'body'只能出现一次『body父级错误』
194|template中：标签'mip-link'中的属性'href'的属性值'tel:-'无效，标签'a'中的属性'href'的属性值'tel:13ddff'无效
195|template中：强制性标签`<body>`缺失或错误
196|template中：禁止使用`<script src=\"./bn_files/ds.js\">`标签
197|template中：禁止使用`<frame>`,`<frameset>`标签
198|template中：标签`<meta http-equiv=\"/Content-Type/i\">`只能出现一次
199|template中：标签'meta'的直接父标签应该是'head'，而不是'body'
200|template中：标签'link'的直接父标签应该是'head'，而不是'body'
201|template中：标签'style'的直接父标签应该是'head'，而不是'body'
202|标签'a'中的属性'href'的属性值'sms:'无效
203|标签'mip-video'中的既无属性'src'也无子节点 source
212|标签'mip-vd-baidu'必须包含'title'（非空）, 'poster'（非空）, 'src'（http[s]或//开头）属性
213|标签'script'在head中使用时应该家'async'属性

# 新增规则

页面编码|说明|状态
---|---
214|不存在 mip.css 标签|不通过
215|存在 2 个 rel="canonical" 的标签|不通过
216|存在 2 个 rel="miphtml" 的标签|不通过
217|既存在 rel="miphtml"，又存在 rel="canonical"|不通过
218|rel="canonical"，href不为 https, http, // 开头|不通过
219|rel="miphtml"，href不为 https, http, // 开头|不通过
220|非 rel="canonical"，rel="miphtml"，href为 / 开头（非 //）|不通过
221|以上所有规则都满足，同时 rel="canonical" 时，href 为 https 开头|通过
222|以上所有规则都满足，同时 rel="canonical" 时，href 为 http 开头|通过
223|以上所有规则都满足，同时 rel="canonical" 时，href 为 // 开头|通过
224|以上所有规则都满足，link 在非 head 标签中|不通过
225|不存在 mip.js 标签|不通过
226|src 存在且符合规范，type 非 application/javascript 或 text/javascript 或空|不通过
227|src 存在且符合规范，type 为 application/javascript|通过
228|src 存在且符合规范，type 为 text/javascript|通过
229|src 存在且符合规范，type 为空|通过
230|src 存在，href 非 https, // 开头|不通过
231|src 存在，href 为 https 开头|通过
232|src 存在，href 为 // 开头|通过
233|src 存在，href 为 非 mip 域名|不通过
234|src 存在，href 为 https://c.mipcdn.com/a 的 path|通过
235|src 存在，href 为 https://mipcache.bdstatic.com/a 的 path|通过
236|src 存在，type 为 application/json |不通过
237|src 存在，type 为 application/ld+json |不通过
238|src 存在，href 中包含大写字母 |通过
239|src 存在并符合要求，在 head 中同时没有带 async|不通过
240|src 存在并符合要求，在 head 中带 async|通过
241|src 不存在，type 为非 application/json 或 application/ld+json |不通过
242|src 不存在，type 为 application/json |通过
243|src 不存在，type 为 application/ld+json |通过
244|script符合规则，但是父元素是 template |不通过
245|script符合规则，但是是 ala 的 URL |不通过
246|存在 iframe|不通过
247|src 存在并非空，srcset 不存在|通过
248|src 存在并为空，srcset 不存在|不通过
249|srcset 存在并非空，src 不存在|通过
250|srcset 存在并为空，src 不存在|不通过
251|srcset 和 src 都存在，且 srcset 符合规范，src 为空|不通过
252|srcset 和 src 都存在，且 src 符合规范，srcset 为空|不通过
253|srcset 和 src 都存在，两者都为空|不通过
254|mip-form 规则正确|通过
255|mip-form method 不存在|通过
256|mip-form method 值不正确|不通过
257|title 和 poster 均非空|通过
258|title 属性为空|不通过
259|poster 属性为空|不通过
260|target存在并为 _top，_self, _blank 中的一个，href 不存在|通过
261|href 存在并为 /，target 不存在|通过
262|target存在并非 _top，_self, _blank 中的一个，href 不存在|不通过
263|href 存在并非 /，target 不存在|不通过
264|target和href都存在，但 target 的值不符合要求|不通过
265|target和href都存在，但 href 的值不符合要求|不通过
266|target和href都存在，且值都不符合要求|不通过
267|target和href都存在，且值都符合要求|通过
268|base在非 head中|不通过
269|多个 base|不通过
270|source父元素是 mip-video|通过
271|source父元素是 mip-audio|通过
272|source父元素是 picture|通过
273|source父元素非 mip-video, mip-audio, picture|不通过
274|header中加入只能在 head 中使用的元素|不通过
275|head标签加入了一些属性|通过
276|initial-scale为1|通过
277|initial-scale为1.0|不通过
278|initial-scale为其他|不通过
279|内部以逗号分隔|通过
280|内部以分号分隔|通过
281|内部以其他分隔|不通过
289|src 不存在，type 为 application/mip-script | 通过
290|src 存在，type 为 application/mip-script | 不通过
291|标签 mip-shell 只能出现一次 | 不通过