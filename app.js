require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const { TOKEN, COOKIEEXP, PORT, WEBHOOK_URL, MONGO_URL } = process.env;
const routes = require('./routes');
const app = express();
// const MongoStore = require('connect-mongo');
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://192.168.1.38:5173', 'http://38.242.243.210:5173'],  // Use the correct origin without a trailing slash
    credentials: true
}));

app.use(express.json());

mongoose.connect(MONGO_URL).then(console.log('Connected to MongoDB')).catch(err => console.log(err))

app.use(session({
    secret: "secret",
    cookie: {
        maxAge: (60000 * 60 * 24) * 30,
    },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: MONGO_URL, ttl: 24 * 60 * 60, autoRemove: 'native', touchAfter: 24 * 3600 })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

(async () => {
    const url = `http://38.242.243.210:3030/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}`;
    const req = await fetch(url, {
        method: 'POST'
    });
    const res = await req.json();
    console.log(res);
})();