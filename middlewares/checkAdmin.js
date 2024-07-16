const User = require('../models/user');

async function checkAdmin(req, res, next) {
    try {
        const user = await User.findById(req.user);

        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).send({ error: 'access denied' });
        }
    } catch (err) {
        res.status(500).send({ error: 'server error' });
    }
}

module.exports = { checkAdmin };