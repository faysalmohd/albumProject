const mongoose = require('mongoose')
const userSchema = require('../models/userModel')
const { generateToken } = require('../utils/jwt')
const User = mongoose.model('User', userSchema, 'users')

const userLogin = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password){
        return res.status(400).json({success: false, message: 'Email and Password are required.'})
    }

    try{
        const user = await User.findOne({email})
        if (!user || !(await user.isValidPassword(password, user.password))){
            return res.status(401).json ({success: false, message: 'Invalid email or password.'})
        }

        const token = generateToken(user._id)
        res.status(200).json({success: true, message: 'Token generated', token})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

module.exports = userLogin