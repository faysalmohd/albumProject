const mongoose = require('mongoose')
const userSchema = require('../models/userModel')
const userLogin = require('../auth/userAuth')
const User = mongoose.model('User', userSchema, 'users')

const registerNewUser = async (req, res) => {
    const {name, email, password, confirmPassword} = req.body

    if (!name || !email || !password || !confirmPassword){
        return res.status(400).json({success: false, message: 'All fields are required.'})
    }

    if (password !== confirmPassword){
        return res.status(400).json({success: false, message: 'Passwords do not match.'})
    }

    try{
        const existingUser = await User.findOne({email})
        if (existingUser){
            return res.status(400).json({success: false, message: 'Email already exists.'})
        }

        const user = new User({name, email, password})
        await user.save()
        res.status(201).json({success: true, message: 'User registered successfully.', user})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

const getAllUser = async (req, res) => {
    const users = await User.find()
    res.json(users);
}

const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'User deleted' });
}

module.exports = {
    getAllUser,
    deleteUser,
    registerNewUser,
    userLogin
}