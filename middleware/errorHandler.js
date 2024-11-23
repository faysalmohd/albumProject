const { APIError } = require('../utils/AppError')

const errorHandler = (err, req, res) => { 
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server faysal',
    });
};

module.exports = errorHandler;
