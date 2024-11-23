require('dotenv').config();
const jwt = require('jsonwebtoken');


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { // eslint-disable-line no-undef
        expiresIn: '1h', 
    });
};

module.exports = { generateToken };
