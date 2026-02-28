// Custom Error class for API errors
// @description: This class extends the built-in Error class to include additional properties for API error handling.( errors that i can predict )
class ApiError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')? 'fail' : 'error';
        this.isOperational = true; 
    }
}

module.exports = ApiError;

