const router = require('express').Router();

const Logs = require('../schemas/log');
const User = require('../schemas/users');

router.get('/', async (req, res) => {
    try {
        const logs = await Logs.find().sort({ logDate: -1 });
        const users = await User.find();
        const newLog = []
        logs.forEach((log) => {
            const user = users.find((user) => user._id.toString() === log.userID.toString());
            log = { ...log._doc, username: user.username };
            newLog.push(log);
        });
        res.status(200).json(newLog);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const log = await Logs.findOne({ _id: req.params.id });
        res.status(200).json(log);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
)


module.exports = router;