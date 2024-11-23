require('dotenv').config();
const express = require('express')
const router = require('./routers/routers')
const userLogin = require('./auth/userAuth')
const errorHandler = require('./middleware/errorHandler')
const userController = require('./controllers/userController')
const mongoose = require('mongoose');
const { protect, authorize } = require('./middleware/auth');
const app = express()
const port = process.env.PORT // eslint-disable-line no-undef


app.use(express.json())
app.use(express.static('public'))
app.use('/album', router)
app.use('/login', userLogin)
app.get('/user', protect, authorize('admin'), userController.getAllUser)
app.delete('/user/:id', protect, authorize('admin'), userController.deleteUser)
app.use(errorHandler)

mongoose.connect(process.env.DB_URI, { // eslint-disable-line no-undef
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log("Database Connected");
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
    console.log(`http://localhost:${port}/album`);
})

module.exports = app