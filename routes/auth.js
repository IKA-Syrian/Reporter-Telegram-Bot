const router = require('express').Router();
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../schemas/users');
const authMiddleware = require('../handler/authMiddleware');

router.post('/register', authMiddleware, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const browserId = req.headers['user-agent'];
        const sessionId = req.sessionID;
        const userIp = req.headers['x-real-ip'];
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword, browserId, sessionId, userIp);
        const jwtToken = jwt.sign({ username, browserId, sessionId, userIp }, process.env.JWT_SECRET);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.cookie('token', jwtToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 3600000 })
        res.status(201).json({
            message: 'User registered successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                message: 'Invalid password',
            });
        }
        const browserId = req.headers['user-agent'];
        const sessionId = req.sessionID;
        const userIp = req.headers['x-real-ip'];
        const id = user._id;
        const jwtToken = jwt.sign({ id, browserId, sessionId, userIp }, process.env.JWT_SECRET);
        req.session.save();
        res.status(200).json({
            message: 'User logged in successfully',
            jwtToken,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post('/logout', authMiddleware, async (req, res) => {
    try {
        res.setHeader('Authorization', '');
        res.status(200).json({
            message: 'User logged out successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post('/refresh', authMiddleware, async (req, res) => {

});
module.exports = router;