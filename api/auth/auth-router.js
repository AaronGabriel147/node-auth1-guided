const router = require('express').Router();
const bcrypt = require('bcryptjs')
// const { add, findBy } = require('../users/users-model') // this is the same as const Users = require("./users-model.js")
const Users = require('../users/users-model')

// const validatePayload = (req, res, next) => {
//     next();
// };

// res.json(hash) // Sorta like .logging



router.post('/register', async (req, res, next) => {

    const { username, password } = req.body;       // Take whatever the user types
    const hash = bcrypt.hashSync(password, 8);     // Encrypts the user's password
    const user = { username, password: hash }      // Create a user object with the username and hashed password

    try {
        const createdUser = await Users.add(user)  // add is a function in users-model.js ~~~ Knex = db('users').insert(user)
        console.log(createdUser)
        res.status(201).json(createdUser)          // 201 / json = Created
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', err });
    }
})

// ____________________________________________________________________________

// Check is user exists by hash
// The if statement && section is referencing the console.log that looks like this:
//   [
//     {
//       id: 2,
//       username: 'Epictetus',
//       password: '$2a$08$MaiVNmSJU9QCoBTzN93Nk.xUElgb.KTlWkzCFmUAwWq5eV3RVS0Ri'
//     }
//   ]
// existing can be refactored to: [user] but it can be dangerous to use because sometimes it will not be an array. 

// *** 

// Session
// console.log(req.session) is how you test if the express-session is working and the config is working. Console looks like:
// Session {
//     cookie: {
//       path: '/',
//       _expires: 2021-12-04T02:43:20.259Z,
//       originalMaxAge: 604800000,
//       httpOnly: false,
//       secure: false
//     }
//   }

// WORKS!!!!!!
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const [user] = await Users.findBy({ username })            // This is the user from the database.
        if (user && bcrypt.compareSync(password, user.password)) { // bcrypt line is testing the decrypted pw
            console.log(req.session)                               // user is being retrieved from db with decrypted password
            req.session.user = user // A cookie will be set on response. The session will be stored in the server. // In Insomnia click Headers to see set cookie.
            console.log('user ---->', user)
            return res.json({ message: `You are logged in ${username}, have a cookie!` })
        }
        next({ status: 401, message: 'Invalid Credentials from login' }); // Sometimes this needs a return in front of it.
    } catch (err) {
        next(err);
    }
});




// There are at least 3 ways you can write your 400 error message.***
// else {
//     res.status(401).json({ message: 'Invalid Credentials' });
// }

// else {
//     next({ status: 401, message: 'Invalid Credentials' });
// }


// ___________ KIRKBYS login below ___________
// Did not work for me. 
// router.post('/login', (req, res, next) => {
//     const { username, password } = req.body;

//     Users.findBy({ username })
//         .first()
//         .then(user => {
//             if (user && bcrypt.compareSync(password, user.password)) {
//                 req.session.user = user;
//                 res.status(200).json({ message: `Welcome ${user.username}!` });
//             } else {
//                 next({ status: 401, message: 'Invalid Credentials' });
//             }
//         })
//         .catch(next({ status: 500, message: 'Something went wrong in with login' }));
// });







router.get('/logout', async (req, res, next) => {
    try {
        if (req.session.user) {
            req.session.destroy(() => {                            // This is the session.destroy() method.
                res.status(200).json({ message: 'Logged Out' })
            })
        }
        next({ status: 401, message: 'Not logged in' })
    } catch (err) {
        next(err);
    }
})




module.exports = router;