#!bin/sh

file=$(ls examples/htmls/)
for i in $file
do
	node bin/cli.js < examples/htmls/$i > examples/results/$i.json
done