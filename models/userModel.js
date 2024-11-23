const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be 8 character or more.'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    updatedAt: {
        type: Date
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        this.updatedAt = Date.now();
        next()
    } catch (error) {
        next(error)
    }
    next();
});

userSchema.methods.isValidPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}

module.exports = userSchema;