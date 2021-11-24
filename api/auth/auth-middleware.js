

function restricted(req, res, next) {
    console.log('restricted to auth users only');
    next(); // if we don't call next, the request will hang
}


module.exports = { restricted, };
