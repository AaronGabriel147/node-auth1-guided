const router = require('express').Router();
const bcrypt = require('bcryptjs')
// const { add } = require('../users/users-model')


const validatePayload = (req, res, next) => {
    next();
};

router.post('/register', validatePayload, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hash = bcrypt.hashSync(password, 8);
        console.log(hash)
        res.json(hash)
    } catch (error) {
        next(error);
    }
})


router.post('/login', async (req, res, next) => {
    res.json('register wired!')
})


router.get('/logout', async (req, res, next) => {
    res.json('register wired!')
})


module.exports = router;