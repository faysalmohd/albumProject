const mongoose = require('mongoose')
const albumSchema = require('../models/albumModel')
const Album = mongoose.model('Album', albumSchema, 'album')
// const Album = mongoose.model('Album', albumSchema, 'testAlbum') // CHANGE WHEN NOT IN BACK-END TESTING
//const { APIError } = require('../utils/AppError')

const getAllAlbum = async (req, res) => {
    const { sortBy = 'artist', order = 'asc', minYear, maxYear, year, fields, search } = req.query;

    let query = {};

    if (search) {
        query.$or = [
            { artist: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
        ];
    }

    if (year) {
        query.year = Number(year);
    }

    if (minYear || maxYear) {
        query.year = {};
        if (minYear) query.year.$gte = Number(minYear);
        if (maxYear) query.year.$lte = Number(maxYear);
    }

    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        console.log()
        albums = albums.select(fieldsList);
    }
        
    let albums = await Album.find(query);

    albums.sort((a, b) => {
        const fieldA = a[sortBy];
        const fieldB = b[sortBy];

        if (order === 'desc') {
            return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
        } else {
            return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
        }
    }); 

    res.status(200).json({ album: albums });
}

const getAlbumById = async (req, res) => {
    const album = await Album.findById(req.params.id);
    if (!album) {
        return res.status(404).json({ message: 'Album not found' });
        //throw new APIError(`Album with id "${req.params.id}" not found`, 404)
    }
    res.json(album);
}

const addAlbum = async (req, res) => {
    const album = new Album({ ...req.body, owner: req.user.id });
    await album.save();
    res.status(201).json({ success: true, album });
}

const updateAlbum = async (req, res) => {
    const { id } = req.params;
    const { field, value } = req.query;

    const album = await Album.findById(id);

    if (!album) {
        return res.status(404).json({ error: 'Album not found' });
        //throw new APIError(`Album with id "${id}" not found`, 404)
    }

    if (req.user.role !== 'admin' && album.owner.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    if (field && value) {
        if (album[field] !== undefined) {
            album[field] = value;
        } else {
            return res.status(400).json({ error: `Field '${field}' does not exist on the album.` });
            //throw new APIError(`Field '${field}' does not exist on the album.`, 404)
        }
    } else {
        return res.status(400).json({ error: 'Both field and value are required for update.' });
        //throw new APIError(`Both field and value are required for update.`, 400)
    }

    await album.save();

    res.json({ message: 'Album updated successfully', album });
}

const deleteAlbum = async (req, res) => {
    const album = await Album.findById(req.params.id);
    if (!album) {
        return res.status(404).json({ message: 'Album not found' });
        //throw new APIError(`Album with id "${req.params.id}" not found`, 404)
    }

    if (req.user.role !== 'admin' && album.owner.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    }

    await Album.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Album deleted successfully' });
}

module.exports = {
    getAllAlbum,
    getAlbumById,
    addAlbum,
    updateAlbum,
    deleteAlbum
}