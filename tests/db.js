var  chai = require('chai'),
	  chaiAsPromised = require("chai-as-promised"),
	  expect = chai.expect;

chai.use(chaiAsPromised);

describe('mongodb', function () {

	global.db = require('../modules/db')(appconfig);

	it('must connect', function() {

		return expect(db.connectPromise).to.be.fulfilled;

	});
	
});