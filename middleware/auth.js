require('dotenv').config();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userSchema = require('../models/userModel')
const User = mongoose.model('User', userSchema, 'users')
const asyncHandler = require('express-async-handler');

const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)// eslint-disable-line no-undef
        req.user = await User.findById(decoded.id).select('password')
        next()
    } catch {
        res.status(401).json({success: false, message: 'Invalid token.'})
    }
})

exports.protect = authenticate

const authorize = (...roles) => {
    return async (req, res, next) => {
        const userRole = await User.findById(req.user._id).select('role')
        if (!roles.includes(userRole.role)){
            return res.status(403).json({success: false, message: 'Forbidden: Access denied.'})
        }
        next()
    }
}

exports.authorize = authorize