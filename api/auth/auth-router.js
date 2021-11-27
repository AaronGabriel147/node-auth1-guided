const router = require('express').Router();
const bcrypt = require('bcryptjs')
const { add, findBy } = require('../users/users-model')


const validatePayload = (req, res, next) => {
    next();
};

router.post('/register', validatePayload, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hash = bcrypt.hashSync(password, 8);
        // res.json(hash) // Sorta like .logging
        const user = { username, password: hash }
        const createdUser = await add(user)
        console.log(createdUser)
        res.status(201).json(createdUser)
    } catch (error) {
        next(error);
    }
})


// The if statement && section is referencing the console.log that looks like this:
//   [
//     {
//       id: 2,
//       username: 'Epictetus',
//       password: '$2a$08$MaiVNmSJU9QCoBTzN93Nk.xUElgb.KTlWkzCFmUAwWq5eV3RVS0Ri'
//     }
//   ]
// existing can be refactored to: [user] but it can be dangerous to use because sometimes it will not be an array. 

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existing = await findBy({ username }) // This is the user from the database.
        if (existing.length && bcrypt.compareSync(password, existing[0].password)) { // bcrypt line is testing the decrypted pw
            console.log('existing --->', existing) // user is being retrieved from db with decrypted password
            console.log(req.session)
            // res.status(200).json({
            //     message: `Welcome ${existing.username}!`
            // })
        }

        next({ status: 401, message: 'Invalid Credentials' }); // Sometimes this needs a return in front of it.

        // else {
        //     res.status(401).json({ message: 'Invalid Credentials' });
        // }

        // else {
        //     next({ status: 401, message: 'Invalid Credentials' });
        // }


    } catch (error) { // ask for a 1 line version
        next(error);
    }
});



router.get('/logout', async (req, res, next) => {
    res.json('register wired!')
})


module.exports = router;