const router = require("express").Router();
const authMiddleware = require('../handler/authMiddleware');

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

// router.post("/", async (req, res) => {
//     try {
//         const
//     }

module.exports = router;