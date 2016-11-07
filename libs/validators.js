
var _ = require('lodash');

/**
 * Custom Validators
 */
module.exports = {

	/**
	 * Determines if value is an array and isn't empty.
	 *
	 * @param      {<type>}   val     The value
	 * @return     {Promise}  True if array, False otherwise.
	 */
	isArray(val) {
		return _.isArray(val) && val.length > 0;
	}

};