module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'Please log in to view this resource');
        res.redirect('/auth/login');
    },
    ensureGuest: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/transactions/list');
    }
};