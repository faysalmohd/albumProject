const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController')
const userController = require('../controllers/userController')
const { protect, authorize } = require('../middleware/auth');

router.get('/', albumController.getAllAlbum);

router.get('/:id', albumController.getAlbumById);

router.post('/', protect, albumController.addAlbum);

router.put('/:id', protect, albumController.updateAlbum);

router.delete('/:id', protect, albumController.deleteAlbum);

router.post('/register', userController.registerNewUser)

router.get('user/', protect, authorize('admin'), userController.getAllUser)

router.delete('user/:id', protect, authorize('admin'), userController.deleteUser)

module.exports = router;