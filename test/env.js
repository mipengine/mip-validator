const chai = require("chai");

chai.use(require('sinon-chai'));
chai.use(require("chai-as-promised"));

exports.chai = chai;
exports.expect = chai.expect;

