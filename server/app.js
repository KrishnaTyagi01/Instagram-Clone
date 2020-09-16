const express = require('express');
const app = express();
const PORT = 80;
const mongoose = require('mongoose');

const { MONGOURI } = require('./keys');

mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to Mongo');
});
mongoose.connection.on('error', (err) => {
    console.log('Connection error', err);
});

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));


app.listen(PORT, () => {
    console.log(`App running at port ${PORT}`);

});
