const ResidentModel = require('../models/ResidentModel');

// Data admin untuk halaman
function getAdmin(req) {
    return {
        name: req.session.user.nama,
        role: 'Administrator'
    };
}

// Menampilkan daftar lansia
async function index(req, res) {
    try {
        const residents = await ResidentModel.getAll();

        res.render('admin/residents', {
            admin: getAdmin(req),
            residents,
            alertCount: 0,
            adminBasePath: '/admin',
            logoutUrl: '/logout'
        });
    } catch (error) {
        console.error('[RESIDENT] Gagal mengambil data:', error.message);
        res.status(500).send('Gagal mengambil data lansia.');
    }
}

// Menampilkan form tambah
function createForm(req, res) {
    res.render('admin/resident-form', {
        admin: getAdmin(req),
        mode: 'create',
        resident: null,
        errors: {},
        alertCount: 0,
        adminBasePath: '/admin',
        logoutUrl: '/logout'
    });
}

// Menyimpan data lansia
async function store(req, res) {
    try {
        const {
            fullName,
            birthDate,
            gender,
            address,
            phone,
            familyContactName,
            familyContactPhone
        } = req.body;

        if (!fullName || !birthDate || !gender || !address) {
            return res.status(400).send('Nama, tanggal lahir, jenis kelamin, dan alamat wajib diisi.');
        }

        await ResidentModel.create({
            fullName,
            birthDate,
            gender,
            address,
            phone,
            familyContactName,
            familyContactPhone
        });

        res.redirect('/admin/residents');
    } catch (error) {
        console.error('[RESIDENT] Gagal menambahkan data:', error.message);
        res.status(500).send('Gagal menambahkan data lansia.');
    }
}

// Menampilkan detail lansia
async function detail(req, res) {
    try {
        const resident = await ResidentModel.findById(req.params.id);

        if (!resident) {
            return res.status(404).send('Data lansia tidak ditemukan.');
        }

        res.render('admin/resident-detail', {
            admin: getAdmin(req),
            resident,
            alertCount: 0,
            adminBasePath: '/admin',
            logoutUrl: '/logout'
        });
    } catch (error) {
        console.error('[RESIDENT] Gagal mengambil detail:', error.message);
        res.status(500).send('Gagal menampilkan detail lansia.');
    }
}

// Menampilkan form edit
async function editForm(req, res) {
    try {
        const resident = await ResidentModel.findById(req.params.id);

        if (!resident) {
            return res.status(404).send('Data lansia tidak ditemukan.');
        }

        res.render('admin/resident-form', {
            admin: getAdmin(req),
            mode: 'edit',
            resident,
            errors: {},
            alertCount: 0,
            adminBasePath: '/admin',
            logoutUrl: '/logout'
        });
    } catch (error) {
        console.error('[RESIDENT] Gagal membuka form edit:', error.message);
        res.status(500).send('Gagal membuka form edit.');
    }
}

// Memperbarui data lansia
async function update(req, res) {
    try {
        const {
            fullName,
            birthDate,
            gender,
            address,
            phone,
            familyContactName,
            familyContactPhone
        } = req.body;

        if (!fullName || !birthDate || !gender || !address) {
            return res.status(400).send('Nama, tanggal lahir, jenis kelamin, dan alamat wajib diisi.');
        }

        const existing = await ResidentModel.findById(req.params.id);

        if (!existing) {
            return res.status(404).send('Data lansia tidak ditemukan.');
        }

        await ResidentModel.update(req.params.id, {
            fullName,
            birthDate,
            gender,
            address,
            phone,
            familyContactName,
            familyContactPhone
        });

        res.redirect('/admin/residents');
    } catch (error) {
        console.error('[RESIDENT] Gagal memperbarui data:', error.message);
        res.status(500).send('Gagal memperbarui data lansia.');
    }
}

// Menghapus data lansia
async function destroy(req, res) {
    try {
        const existing = await ResidentModel.findById(req.params.id);

        if (!existing) {
            return res.status(404).send('Data lansia tidak ditemukan.');
        }

        await ResidentModel.remove(req.params.id);

        res.redirect('/admin/residents');
    } catch (error) {
        console.error('[RESIDENT] Gagal menghapus data:', error.message);
        res.status(500).send('Gagal menghapus data lansia. Data mungkin masih digunakan oleh tabel lain.');
    }
}

module.exports = {
    index,
    createForm,
    store,
    detail,
    editForm,
    update,
    destroy
};
