# Reporter-Telegram-Bot

A Telegram Bot For Balqees reporter to submit a report through it

# Installation

1. Clone the repository
2. Run `npm install` for backend dependencies
3. Create a `.env` file and add the following:

```
TOKEN=YOUR_BOT_TOKEN
JWT_SECRET=YOUR_JWT_SECRET
COOKIEEXP=COOKIE_EXPIRATION (e.g. 1d)
PORT=PORT_NUMBER
WEBHOOK_URL=WEBHOOK_URL
MONGODB_URL=MONGODB_URI
```

4. Run `cd frontend && npm install` for frontend dependencies
5. Run `npm run dev` to start the server
6. use admin
   cd frontend && npm install
   cd .. && npm run build:frontend

db.createUser({
user: "Balqees",
pwd: "password",
roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
})

exit

mongosh -u Balqees -p password --authenticationDatabase admin

use Balqees

exit

nano /etc/mongod.conf

net:
port: 5217
bindIp: 127.0.0.1, server-ip

sudo systemctl restart mongod

cd Reporter-Telegram-Bot

cp telegram-config/eco-system.config.js telegram-bot-api/

pm2 start telegram-bot-api/ecosystem.config.js
pm2 startup
pm2 save

```

.env
```
