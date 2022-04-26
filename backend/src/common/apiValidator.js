

// a weird attempt to valid req.body

function validate(req, expected) {
    const givenKeys = Object.keys(req.body);
    return Object.keys(expected).reduce((prev, key) => {
        let result = true;
        if(expected[key].required)
            result = false;
        if(givenKeys.find(item => item === key) !== undefined)
            if(expected[key].type === typeof req.body[key])
                result = true;
            else
                result = false;
        return prev && result;
    }, true);
}

module.exports.validate = validate;