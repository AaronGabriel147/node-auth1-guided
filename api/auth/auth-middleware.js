


// ************* THIS IS BROKEN ********************
// if (req.session.user) { // if user is logged in
//     next();             // allow them to see the page
// } next({ status: 401, message: 'Bad Credentials from restricted midware' }); 


// ************* THIS IS CORRECT ********************
function restricted(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        next({ status: 401, message: 'Bad Credentials from restricted middleware' })
    }


}

module.exports = { restricted };
