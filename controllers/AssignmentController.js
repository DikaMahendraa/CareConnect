const AssignmentModel = require('../models/AssignmentModel');
const CaregiverModel = require('../models/CaregiverModel');

// Menampilkan halaman penugasan
async function index(req, res) {
    try {
        const assignments = await AssignmentModel.getAll();
        const unassignedResidents =
            await AssignmentModel.getUnassignedResidents();
        const caregivers = await CaregiverModel.getAll();

        res.render('admin/assignments', {
            user: req.session.user,
            admin: {
                name: req.session.user.nama,
                role: req.session.user.role
            },
            assignments,
            unassignedResidents,
            caregivers,
            selectedResidentId: req.query.residentId || '',
            errors: {},
            adminBasePath: '/admin'
        });

    } catch (error) {
        console.error('[ASSIGNMENT INDEX ERROR]', error);
        res.status(500).send('Gagal memuat halaman penugasan.');
    }
}

// Membuat penugasan baru
async function store(req, res) {
    try {
        const { residentId, caregiverId } = req.body;

        if (!residentId || !caregiverId) {
            return res.status(400).send(
                'Lansia dan caregiver wajib dipilih.'
            );
        }

        const residents =
            await AssignmentModel.getUnassignedResidents();

        const residentExists = residents.some(
            resident => Number(resident.id) === Number(residentId)
        );

        if (!residentExists) {
            return res.status(400).send(
                'Lansia tidak ditemukan atau sudah memiliki caregiver.'
            );
        }

        const caregiver =
            await CaregiverModel.getById(caregiverId);

        if (!caregiver || caregiver.status !== 'active') {
            return res.status(400).send(
                'Caregiver tidak ditemukan atau akun sedang nonaktif.'
            );
        }

        await AssignmentModel.create(residentId, caregiverId);

        res.redirect('/admin/assignments');

    } catch (error) {
        console.error('[ASSIGNMENT STORE ERROR]', error);
        res.status(500).send('Gagal membuat penugasan.');
    }
}

// Mengubah caregiver pada penugasan
async function update(req, res) {
    try {
        const { caregiverId } = req.body;
        const assignmentId = req.params.id;

        if (!caregiverId) {
            return res.status(400).send(
                'Caregiver wajib dipilih.'
            );
        }

        const assignments = await AssignmentModel.getAll();

        const assignment = assignments.find(
            item => Number(item.id) === Number(assignmentId)
        );

        if (!assignment) {
            return res.status(404).send(
                'Penugasan tidak ditemukan.'
            );
        }

        const caregiver =
            await CaregiverModel.getById(caregiverId);

        if (!caregiver || caregiver.status !== 'active') {
            return res.status(400).send(
                'Caregiver tidak ditemukan atau akun sedang nonaktif.'
            );
        }

        await AssignmentModel.update(assignmentId, caregiverId);

        res.redirect('/admin/assignments');

    } catch (error) {
        console.error('[ASSIGNMENT UPDATE ERROR]', error);
        res.status(500).send('Gagal mengubah penugasan.');
    }
}

// Menghapus penugasan
async function destroy(req, res) {
    try {
        const assignmentId = req.params.id;

        const affectedRows =
            await AssignmentModel.deleteById(assignmentId);

        if (affectedRows === 0) {
            return res.status(404).send(
                'Penugasan tidak ditemukan.'
            );
        }

        res.redirect('/admin/assignments');

    } catch (error) {
        console.error('[ASSIGNMENT DELETE ERROR]', error);
        res.status(500).send('Gagal menghapus penugasan.');
    }
}

module.exports = {
    index,
    store,
    update,
    destroy
};
