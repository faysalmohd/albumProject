const mongoose = require('mongoose')

const currentYear = new Date().getFullYear();
const acceptableGenres = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic', 'Country', 'Reggae'];

const albumSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: [true, 'Artist name is required'],
        minlength: [3, 'Artist name must be at least 3 characters long'],
        maxlength: [50, 'Artist name cannot exceed 50 characters'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'Album title is required'],
        minlength: [3, 'Album title must be at least 3 characters long'],
        maxlength: [50, 'Album title cannot exceed 50 characters'],
        trim: true,
    },
    year: {
        type: Number,
        required: [true, 'Release year is required'],
        min: [1900, 'Release year cannot be earlier than 1900'],
        max: [currentYear, `Release year cannot be later than ${currentYear}`],
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        enum: {
            values: acceptableGenres,
            message: '{VALUE} is not a valid genre. Acceptable genres are: ' + acceptableGenres.join(', '),
        },
    },
    tracks: {
        type: Number,
        required: [true, 'Track count is required'],
        min: [1, 'Track count must be greater than 0'],
        max: [100, 'Track count cannot exceed 100'],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date
    }
})

albumSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = albumSchema;