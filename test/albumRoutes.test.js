const mongoose = require('mongoose');
const supertest = require('supertest');
const albumSchema = require('../models/albumModel');
const TestAlbum = mongoose.model('Albums', albumSchema, 'testAlbum');
const Album = mongoose.model('Albums', albumSchema, 'album');

const app = require('../server');
const api = supertest(app);

let testAlbums
let newTestAlbumId
let token
let initialAlbums
let updatedAlbums

beforeAll(async () => { // eslint-disable-line no-undef
    await TestAlbum.deleteMany({});
    let alb = await Album.find({})
    testAlbums = alb
    await TestAlbum.insertMany(testAlbums);


});

test('Test for the GET /api/albums route that confirms the exact number of albums returned matches the number in your test database.', async () => { // eslint-disable-line no-undef
    const response = await api
        .get('/album')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body.album).toHaveLength(testAlbums.length); // eslint-disable-line no-undef
});

test('Test for the POST /api/albums route to add albums successfully. Verify the album count increases by one and that the newly added album has the correct data.', async () => { // eslint-disable-line no-undef
    const loginResponse = await api
        .post('/login')
        .send({
            email: 'dev@gmail.com',
            password: 'developer',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);

    token = loginResponse.body.token;
    expect(token).toBeDefined(); // eslint-disable-line no-undef

    const newAlbum = {
        artist: 'Lenovo',
        title: 'ThinkPad',
        year: 2020,
        genre: 'Pop',
        tracks: 10
    };

    initialAlbums = await TestAlbum.find({});

    await api
        .post('/album')
        .set('Authorization', `Bearer ${token}`)
        .send(newAlbum)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    updatedAlbums = await TestAlbum.find({});
    expect(updatedAlbums.length).toBe(initialAlbums.length + 1); // eslint-disable-line no-undef

    const lastAddedAlbum = updatedAlbums[updatedAlbums.length - 1];
    newTestAlbumId = lastAddedAlbum.id
    expect(lastAddedAlbum).toMatchObject(newAlbum); // eslint-disable-line no-undef
});

test('Tests to the DELETE /api/albums/:id, confirm an album is successfully deleted. Verify that the album count decreases and the specific album is no longer present. Attempt to delete a non-existent album and check if the API handles this gracefully.', async () => { // eslint-disable-line no-undef
    initialAlbums = await TestAlbum.find({});

    const albumDelete = await api
        .delete(`/album/${newTestAlbumId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    expect(albumDelete.body.message).toBe('Album deleted successfully') // eslint-disable-line no-undef
    updatedAlbums = await TestAlbum.find({});
    expect(updatedAlbums.length).toBe(initialAlbums.length - 1); // eslint-disable-line no-undef

    await api
        .get(`/album/${newTestAlbumId}`)
        .expect(404);

    await api // deleting the album with same id as the previous albumDelete. This should give status(404) as it was deleted earlier
        .delete(`/album/${newTestAlbumId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
});

afterAll(() => { // eslint-disable-line no-undef
    mongoose.connection.close();
});
