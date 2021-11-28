const path = require('path')
const express = require('express')
const helmet = require('helmet')

const session = require('express-session') // session*************************

const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const server = express()

server.use(express.static(path.join(__dirname, '../client')))
server.use(helmet())
server.use(express.json())

server.use(session({                      // session config *************************
  // lots of things to configure
  name: 'monkey',  // name of the cookie, monkey instead of sessionId for the key value pair
  secret: 'make it long and random', // secret for the cookie, sessionId is actually the encrypted.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // cookie will expire in 7 days
    secure: false, // cookie will only be sent over https, in prod this should be true
    httpOnly: true, // JS reading cookie ?
  },
  rolling: true, // session will be renewed every time the user makes a request
  resave: false, // session will not be saved if it is not modified
  saveUninitialized: false, // session will not be saved if it is not modified
}))


server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)


server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})


server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})


server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
