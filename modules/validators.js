
var _ = require('lodash');

/**
 * Custom Validators
 */
module.exports = {

	/**
	 * Determines if value is an array and isn't empty.
	 *
	 * @param      {String}   msg     Error message to display
	 * @return     {Promise}  True if array, False otherwise.
	 */
	isArray(msg) {
		return (val) => {
			return new Promise((resolve, reject) => {
				if(_.isArray(val) && val.length > 0) {
					resolve(val);
				}  else {
					reject(new Error(msg));
				}
			});
		}
	}

};