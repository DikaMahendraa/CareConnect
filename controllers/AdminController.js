const DashboardModel = require('../models/DashboardModel');

async function dashboard(req, res) {
    try {
        const stats = await DashboardModel.getStats();
        const recentActivities = await DashboardModel.getRecentActivities();
        const recentAlerts = await DashboardModel.getRecentAlerts();

        res.render('admin/dashboard', {
            admin: {
                name: req.session.user.nama,
                role: req.session.user.role
            },
            user: req.session.user,
            stats,
            recentActivities,
            recentAlerts,
            adminBasePath: '/admin',
            alertCount: recentAlerts.length
        });

    } catch (error) {
        console.error('[DASHBOARD ERROR]', error);

        res.status(500).send('Terjadi kesalahan saat memuat dashboard.');
    }
}

module.exports = {
    dashboard
};
