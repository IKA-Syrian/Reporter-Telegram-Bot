const router = require("express").Router();
const authMiddleware = require('../handler/authMiddleware');
const bcrypt = require("bcrypt");
const User = require("../schemas/users");
const Logs = require('../schemas/log');
const Dump = require('../schemas/dump');
router.get("/", authMiddleware, async (req, res) => {

    try {
        const users = await User.find().select('-password');;
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.get("/:username", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        res.status(200).json({
            username: user.username,
            isAdmin: user.isAdmin,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.get('/info/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});


router.post("/", authMiddleware, async (req, res) => {
    try {
        const { username, email, password, isAdmin } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, isAdmin: isAdmin || false });
        await user.save();
        res.status(201).json({
            message: "User created successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { username, email, password, isAdmin } = req.body;
        if (password && password !== '') {
            hashedPassword = await bcrypt.hash(password, 10);
            await User.findByIdAndUpdate(req.params.id, {
                username,
                email,
                password: hashedPassword,
                isAdmin: isAdmin || false,
            });
        } else {
            await User.findByIdAndUpdate(req.params.id, { username, email, isAdmin: isAdmin || false });
        }

        res.status(200).json({
            message: "User updated successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.query.username });
        if (!user) {
            res.status(400).json({
                message: "User not found",
            });
            return;
        }
        const prvData = await User.findOne({ _id: req.params.id });
        const newData = await User.findOneAndDelete({ _id: req.params.id });

        const log = new Logs({
            userID: user['_id'], ActionType: 'DELETE USER', logData: {
                from: prvData,
                to: null,
            }
        });
        await log.save();
        const dump = new Dump({
            CollectionName: "Users",
            DumpedData: prvData
        })
        await dump.save();
        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;