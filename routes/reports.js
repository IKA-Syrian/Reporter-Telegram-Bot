const router = require('express').Router();
const path = require('path')
const Reports = require('../schemas/reports');
const User = require('../schemas/users');
const authMiddleware = require('../handler/authMiddleware');
const Logs = require('../schemas/log');
const Dump = require('../schemas/dump');
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { count } = req.query;
        if (count) {
            const reports = await Reports.find().limit(parseInt(count)).sort({ reportDate: -1 });
            res.status(200).json(reports);
        } else {
            const reports = await Reports.find().sort({ reportDate: -1 });
            res.status(200).json(reports);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const report = await Reports.findOne({ reportID: req.params.id });
        res.status(200).json(report);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { reportID, reportDate, reportType, reportDetails, reportStatus } = req.body;
        const report = new Reports({ reportID, reportDate, reportType, reportDetails, reportStatus });
        await report.save();
        res.status(201).json({
            message: 'Report submitted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { reportID, reportDate, reportType, reportDescription, reportStatus, reportAttachments } = req.body.data;
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(400).json({
                message: 'User not found',
            });
            return;
        }
        const prvData = await Reports.findOne({ reportID: req.params.id });
        const newData = await Reports.findOneAndUpdate({ reportID: req.params.id }, { reportID, reportDate, reportType, reportDescription, reportStatus, reportAttachments }, { new: true });
        const userId = user._id;
        const log = new Logs({
            userID: user['_id'], ActionType: 'UPDATE REPORT', logData: {
                from: prvData,
                to: newData,
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
})

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.query.username });
        if (!user) {
            res.status(400).json({
                message: "User not found",
            });
            return;
        }
        const prvData = await Reports.findOneAndDelete({ reportID: req.params.id });
        const log = new Logs({
            userID: user['_id'], ActionType: 'DELETE REPORT', logData: {
                from: prvData,
                to: null,
            }
        });
        await log.save();
        const dump = new Dump({
            CollectionName: "Reports",
            DumpedData: prvData
        });
        await dump.save();
        res.status(200).json({
            message: 'Report deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})
module.exports = router;