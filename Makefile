MINIFY = ./node_modules/.bin/uglifyjs
BROWSERIFY = ./node_modules/.bin/browserify
htmls   = $(shell ls cases/*.html)
results = $(patsubst cases/%.html,cases/%.json, $(htmls))

.PHONY: clean cases dist/mip-validator.js $(results)

dist: dist/mip-validator.min.js

cases: $(results)

$(results):cases/%.json:cases/%.html rules.json 
	node bin/cli.js < $< > $@

dist/mip-validator.min.js: dist/mip-validator.js
	$(MINIFY) $< --output $@

dist/mip-validator.js: 
	echo '(function(define) {' > $@
	$(BROWSERIFY) index.js -s MIPValidator -t [ babelify --global true --presets [ es2015 ] ] >> $@
	echo '})();' >> $@
