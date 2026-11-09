// Memastikan pengguna sudah login
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
}

// Memastikan pengguna memiliki role tertentu
function requireRole(role) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        if (req.session.user.role !== role) {
            return res.status(403).send('Akses ditolak! Anda tidak memiliki izin.');
        }

        next();
    };
}

module.exports = {
    requireAuth,
    requireRole
};
