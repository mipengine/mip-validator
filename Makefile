.PHONY: clean examples

htmls = $(shell find examples/htmls -name "*.html")

results = $(patsubst examples/htmls/%,examples/results/%.json, $(htmls))

default:

examples: $(results)

$(results):examples/results/%.json:examples/htmls/% examples/conf.json 
	node bin/cli.js -c examples/conf.json < $< > $@

