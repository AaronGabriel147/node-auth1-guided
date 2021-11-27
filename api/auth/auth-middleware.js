

function restricted(req, res, next) {
    if (req.session.user) { // if user is logged in
        console.log('user is logged in per mid ware')
        next();             // allow them to see the page
    } next({ status: 401, message: 'Bad Credentials from restricted midware' }); // else not logged in so 401 err
}

module.exports = { restricted };
