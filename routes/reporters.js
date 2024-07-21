const router = require('express').Router();
const path = require('path')
const Reporter = require('../schemas/reporter');
const authMiddleware = require('../handler/authMiddleware');
const User = require('../schemas/users');
const Logs = require('../schemas/log');
const Dump = require('../schemas/dump');
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { count } = req.query;
        if (count) {
            const reporter = await Reporter.find().limit(parseInt(count)).sort({ reportDate: -1 });
            res.status(200).json(reporter);
        } else {
            const reporter = await Reporter.find().sort({ reportDate: -1 });
            res.status(200).json(reporter);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const reporter = await Reporter.findOne({ TelegramId: req.params.id });
        res.status(200).json(reporter);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const reporter = new Reporter({ name, email, phone, message });
        await reporter.save();
        res.status(201).json({
            message: 'Report submitted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {

        const { firstName, lastName, phoneNumber, city, Verified, isBlocked } = req.body.data;
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(400).json({
                message: 'User not found',
            });
            return;
        }
        const prvData = await Reporter.findOne({ TelegramId: req.params.id });
        const newData = await Reporter.findOneAndUpdate({ TelegramId: req.params.id }, { firstName, lastName, phoneNumber, city, Verified, isBlocked }, { new: true });

        console.log(newData)
        const log = new Logs({
            userID: user['_id'],
            ActionType: 'UPDATE REPORTER',
            logData: {
                from: prvData,
                to: newData
            }
        });
        await log.save();
        res.status(200).json({
            message: 'Report updated successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Reporter.findOneAndDelete({ TelegramId: req.params.id });
        res.status(200).json({
            message: 'Report deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
module.exports = router;