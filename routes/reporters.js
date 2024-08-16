const router = require('express').Router();
const path = require('path')
const Reporter = require('../schemas/reporter');
const authMiddleware = require('../handler/authMiddleware');
const User = require('../schemas/users');
const Logs = require('../schemas/log');
const Dump = require('../schemas/dump');
const { application } = require('express');
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { count } = req.query;
        if (count) {
            const reporter = await Reporter.find().limit(parseInt(count)).sort({ reportDate: -1 });
            res.status(200).json(reporter);
        } else {
            const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'city'];
            const pipeline = [{
                $match: {
                    $and: requiredFields.map(field => ({ [field]: { $exists: true, $ne: null } }))
                }
            }];
            const reporter = await Reporter.aggregate(pipeline).sort({ reportDate: -1 });
            res.status(200).json(reporter);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
router.get('/search', authMiddleware, async (req, res) => {
    try {
        const { search } = req.query;
        const reporter = await Reporter.find({ $text: { $search: search } });
        res.status(200).json(reporter);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.get('/chart', authMiddleware, async (req, res) => {
    const { peroid } = req.query;
    const date = new Date();
    let startDate = new Date();
    let endDate = new Date();
    switch (peroid) {
        case "1":
            startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
            break;
        case "7":
            startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
            break;
        case "14":
            startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 14);
            break;
        case "30":
            startDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
            break;
        case "60":
            startDate = new Date(date.getFullYear(), date.getMonth() - 2, date.getDate());
            break;
        default:
            startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            break;
    }
    const reporter = await Reporter.find({ createdAt: { $gte: startDate, $lt: endDate } });
    const chartData = reporter.map((reporter) => {
        return {
            createdAt: reporter.createdAt,
        }
    });
    res.status(200).json(chartData);
})

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
        if (prvData.isBlocked === true && isBlocked === false) {
            invalidAttempts = 0;
            newData = await Reporter.findOneAndUpdate({ TelegramId: req.params.id }, { firstName, lastName, phoneNumber, city, Verified, isBlocked, invalidAttempts }, { new: true });
        } else {
            newData = await Reporter.findOneAndUpdate({ TelegramId: req.params.id }, { firstName, lastName, phoneNumber, city, Verified, isBlocked }, { new: true });
        }

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