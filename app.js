require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');
const { TOKEN, PORT, WEBHOOK_URL } = process.env;
const routes = require('./routes');
const app = express();

app.use(express.json());
app.use('/api', routes)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

(async () => {
    const url = `https://api.telegram.org/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}`;
    const req = await fetch(url, {
        method: 'POST'
    });
    const res = await req.json();
    console.log(res);
})();