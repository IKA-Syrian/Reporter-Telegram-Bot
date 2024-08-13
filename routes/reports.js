const router = require('express').Router();
const fetch = require('node-fetch');
const path = require('path')
const Reports = require('../schemas/reports');
const User = require('../schemas/users');
const authMiddleware = require('../handler/authMiddleware');
const Logs = require('../schemas/log');
const Dump = require('../schemas/dump');

async function sendTelegramMessage(chatID, message) {
    try {
        const { TELEGRAM_URL, TOKEN } = process.env;
        const url = `${TELEGRAM_URL}/bot${TOKEN}/sendMessage?chat_id=${chatID}&text=${message}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

router.get('/', authMiddleware, async (req, res) => {
    try {
        const { count } = req.query;
        if (count) {
            const total = await Reports.countDocuments();
            const reports = await Reports.find().limit(parseInt(count)).sort({ reportDate: -1 });
            res.status(200).json({
                total,
                reports
            });
        } else {
            const reports = await Reports.find().sort({ reportDate: -1 });
            res.status(200).json(reports);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
router.get('/search', authMiddleware, async (req, res) => {
    try {
        const { search } = req.query;
        const reports = await Reports.find({ $text: { $search: search } });
        res.status(200).json(reports);
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
            break
    }
    const reports = await Reports.find({ reportDate: { $gte: startDate, $lt: endDate } });
    const chartData = reports.map(report => {
        return {
            reportDate: report.reportDate,
        }
    });
    // console.log(chartData);
    res.status(200).json(chartData);
})
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
        const { reportID, reportDate, reportType, reportDescription, reportStatus, reportAttachments, rejectionReason } = req.body.data;
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.status(400).json({
                message: 'User not found',
            });
            return;
        }
        const prvData = await Reports.findOne({ reportID: req.params.id });
        switch (reportStatus) {
            case 'accepted':
                message = `لقد تم قبول تقريرك الذي يحمل الرقم ${reportID}، شكراً لك.`;
                sendTelegramMessage(prvData.TelegramId, message);
                break;
            case 'rejected':
                message = `لقد تم رفض تقريرك الذي يحمل الرقم ${reportID}، بسبب ${rejectionReason}، يرجى التأكد من البيانات المدخلة وإعادة المحاولة.`;
                sendTelegramMessage(prvData.TelegramId, message);
                break;
            default:
                reportStatus = 'Pending';
        }
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