const router = require('express').Router();
const path = require('path')
const fs = require('fs')

const links = []

const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if (stat.isDirectory()) {
            readCommands(path.join(dir, file))
        } else if (file !== 'index.js') {
            const option = require(path.join(__dirname, dir, file))
            links.push(option)
            if (router) {
                const commandBase = require(`./${file.split('.')[0]}`)
                console.log(`Registering routes "${file.split('.')[0]}"`)
                router.use(`/${file.split('.')[0]}`, commandBase);
            }
        }
    }
}
readCommands('.')
module.exports = router;
