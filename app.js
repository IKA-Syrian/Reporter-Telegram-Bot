require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const { TOKEN, COOKIEEXP, PORT, WEBHOOK_URL, MONGO_URL, TELEGRAM_URL, DASHBOARD_URL } = process.env;
const routes = require('./routes');
const app = express();
const helmet = require('helmet');
app.disable('x-powered-by');

// const MongoStore = require('connect-mongo');
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5001', DASHBOARD_URL],  // Use the correct origin without a trailing slash
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
const cspDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://trusted.cdn.com"],
    imgSrc: ["'self'", "data:", "https://cdn.cloudflare.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: [],
};

app.use(helmet.contentSecurityPolicy({ directives: cspDirectives }));
app.use(helmet.dnsPrefetchControl({ allow: false })); // Disable DNS prefetching
app.use(helmet.frameguard({ action: 'deny' })); // Disable iframe embedding
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true })); // HTTP Strict Transport Security
app.use(helmet.ieNoOpen()); // X-Download-Options for IE
app.use(helmet.noSniff()); // X-Content-Type-Options nosniff
app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: 'none' })); // X-Permitted-Cross-Domain-Policies
app.use(helmet.referrerPolicy({ policy: 'no-referrer' })); // Referrer Policy
app.use(helmet.xssFilter()); // X-XSS-Protection

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

(async () => {
    const url = `${TELEGRAM_URL}/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}`;
    const req = await fetch(url, {
        method: 'POST'
    });
    const res = await req.json();
    console.log(res);
})();