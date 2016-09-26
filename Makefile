MINIFY = ./node_modules/.bin/uglifyjs
BROWSERIFY = ./node_modules/.bin/browserify
.PHONY: clean examples dist/mip-validator.js

htmls = $(shell find examples/htmls -name "*.html")

results = $(patsubst examples/htmls/%,examples/results/%.json, $(htmls))

default: 

examples: $(results)

dist: dist/mip-validator.min.js

$(results):examples/results/%.json:examples/htmls/% rules.json 
	node bin/cli.js < $< > $@

dist/mip-validator.min.js: dist/mip-validator.js
	$(MINIFY) $< --output $@

dist/mip-validator.js: 
	echo '(function(define) {' > $@
	$(BROWSERIFY) index.js -s MIPValidator -t [ babelify --global true --presets [ es2015 ] ] >> $@
	echo '})();' >> $@
