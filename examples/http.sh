#!/usr/bin/env bash
# start http server first: node ./bin/http.js

curl localhost:4444/validate -X POST --data '<html></html>'
