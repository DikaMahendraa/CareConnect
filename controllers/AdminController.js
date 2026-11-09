function dashboard(req, res) {
    res.render('admin/dashboard', {
        user: req.session.user
    });
}

module.exports = {
    dashboard
};
