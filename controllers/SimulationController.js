const SimulationModel = require('../models/SimulationModel');

// Menampilkan halaman Simulation
async function index(req, res) {
    try {
        const residents = await SimulationModel.getResidents();

        res.render('admin/simulation', {
            residents,
            adminName: req.session.user.nama,
            success: req.query.success || null,
            error: null
        });

    } catch (error) {
        console.error('[SIMULATION INDEX]', error);

        res.status(500).send('Gagal memuat halaman Simulation.');
    }
}

// Memproses simulasi
async function store(req, res) {
    try {
        const { residentId, eventType, description } = req.body;

        if (!residentId || !eventType) {
            return res.redirect('/admin/simulation?error=missing');
        }

        await SimulationModel.createSimulation({
            residentId,
            eventType,
            description: description || 'Simulasi aktivitas lansia.'
        });

        return res.redirect('/admin/simulation?success=created');

    } catch (error) {
        console.error('[SIMULATION STORE]', error);

        return res.redirect('/admin/simulation?error=failed');
    }
}

module.exports = {
    index,
    store
};