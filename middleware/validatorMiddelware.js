const { validationResult } = require('express-validator');

const validatorMiddleware = (req, res, next) => {
    // catch the validation errors
    const errors = validationResult(req);
    // console.log(errors);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
};

module.exports = validatorMiddleware;