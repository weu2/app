// a weird attempt to valid req.body

function validate(req, expected) {
	const givenKeys = Object.keys(req.body);
	return Object.keys(expected).reduce((prev, key) => {
		let result = !expected[key].required;
		if (givenKeys.find(item => item === key) !== undefined) {
			if (expected[key].type === "numberString") {
				result = !isNaN(parseFloat(req.body[key]));
			} else {
				result = expected[key].type === typeof req.body[key];
			}
		}
		return prev && result;
	}, true);
}

module.exports.validate = validate;