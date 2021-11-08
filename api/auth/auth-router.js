const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body
    // NEVER STORE PLAIN TEXT PASSWORDS IN DB!
    const hash = bcrypt.hashSync(password, 6) // 2 ^ 6
    const newUser = { username, password: hash }
    const user = await User.add(newUser)
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    // pull u/p from req.body
    // verify that username exists
    // verify that password is legit
    // START SESSION (magic line)
    const { username, password } = req.body
    const [user] = await User.findBy({ username })
    if (!user) { // TEST THIS
      return next({ status: 401, message: 'you do not belong here!' })
    }
    const doesPasswordCheck = bcrypt.compareSync(password, user.password)
    if (!doesPasswordCheck) { // TEST THIS
      return next({ status: 401, message: 'something stinks about your credentials!' })
    }
    // add a key to req.session to trigger the session into being stored, cookie sent...
    req.session.user = user // creates & stores the session, sets SET-COOKIE with sid...
    res.json({ message: `welcome, ${user.username}` })
  } catch (err) {
    next(err)
  }
})

router.get('/logout', async (req, res, next) => {
  if (!req.session.user) {
    return res.json({ message: 'excuse me? you were not logged in!' })
  }
  req.session.destroy(() => {}) // async, old style Node
})

module.exports = router
