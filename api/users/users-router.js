const router = require("express").Router()
const restricted = require('../auth/auth-middleware')
const Users = require("./users-model.js")



router.get("/", restricted, (req, res, next) => {
  // console.log("req.user", req.user)
  Users.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
})



// router.get("/", restricted, (req, res, next) => {
//   const userList = Users.find()
//   console.log("req.user", userList)
//     .then(users => {
//       console.log('users', users)
//         .json(users)
//     })
//     .catch(next)
// })



// router.get("/", restricted, async (req, res, next) => {
//   try {
//     const userList = await Users.find()
//     console.log("req.user", userList)
//   } catch (error) {
//     next(error)
//   }
// })






// // Get all logged in users from the data base. Do not send a response.
// router.get("/", restricted, async (req, res, next) => {
//   try {

//   } catch (error) {
//     next(error)
//   }
// })



module.exports = router
