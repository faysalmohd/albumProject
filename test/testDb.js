const mongoose = require('mongoose');
const albumModel = require('../models/albumModel');
const Album = mongoose.model('Album', albumModel, 'testAlbum')

const testAlbums = [
    { artist: 'Toto', title: 'Toto IV', year: 1982, genre: 'Pop', tracks: 10, owner: '673f57458dddea90a5246214' },
    { artist: 'Steely Dan', title: 'Aja', year: 1977, genre: 'Jazz', tracks: 7, owner: '673f57458dddea90a5246214' },
    { artist: 'Miles Davis', title: 'Kind of Blue', year: 1959, genre: 'Jazz', tracks: 5, owner: '673f57458dddea90a5246214' },
];

const setupTestDB = async () => {
    await mongoose.connection.db.dropDatabase();

    await Album.insertMany(testAlbums);
};

module.exports = setupTestDB;
