var  chai = require('chai'),
	  chaiAsPromised = require("chai-as-promised"),
	  expect = chai.expect;

chai.use(chaiAsPromised);

describe('mongodb', function () {

	global.db = require('requarks-core/core-libs/mongodb').init(appconfig);

	it('must connect', function() {

		return expect(db.onReady).to.be.fulfilled;

	});

});
