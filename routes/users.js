const router = require("express").Router();
const authMiddleware = require('../handler/authMiddleware');
const bcrypt = require("bcrypt");
const User = require("../schemas/users");

router.get("/", authMiddleware, async (req, res) => {

    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}
);

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
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(req.params.id, {
            username,
            email,
            password: hashedPassword,
        });
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
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;