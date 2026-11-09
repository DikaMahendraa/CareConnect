
const CaregiverModel = require('../models/CaregiverModel');
const bcrypt = require('bcrypt');

// Menampilkan daftar caregiver
async function index(req, res) {
    try {
        const caregivers = await CaregiverModel.getAll();

        res.render('admin/caregivers', {
            user: req.session.user,
            admin: {
                name: req.session.user.nama,
                role: req.session.user.role
            },
            caregivers,
            adminBasePath: '/admin'
        });
    } catch (error) {
        console.error('[CAREGIVER INDEX ERROR]', error);
        res.status(500).send('Gagal memuat daftar caregiver.');
    }
}

// Menampilkan form tambah caregiver
function createForm(req, res) {
    res.render('admin/caregiver-form', {
        user: req.session.user,
        admin: {
            name: req.session.user.nama,
            role: req.session.user.role
        },
        mode: 'create',
        caregiver: null,
        errors: {},
        adminBasePath: '/admin'
    });
}

// Menyimpan caregiver baru
async function store(req, res) {
    try {
        const {
            fullName,
            email,
            password,
            phone,
            address,
            status
        } = req.body;

        if (!fullName || !email || !password || password.length < 8) {
            return res.status(400).send(
                'Nama, email, dan password minimal 8 karakter wajib diisi.'
            );
        }

        const existingUser = await require('../models/UserModel')
            .findByEmail(email);

        if (existingUser) {
            return res.status(400).send('Email sudah digunakan.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await CaregiverModel.create({
            fullName,
            email,
            password: hashedPassword,
            phone: phone || null,
            address: address || null,
            status: status || 'active'
        });

        res.redirect('/admin/caregivers');

    } catch (error) {
        console.error('[CAREGIVER STORE ERROR]', error);
        res.status(500).send('Gagal menambahkan caregiver.');
    }
}

// Menampilkan detail caregiver
async function detail(req, res) {
    try {
        const caregiver = await CaregiverModel.getById(req.params.id);

        if (!caregiver) {
            return res.status(404).send('Caregiver tidak ditemukan.');
        }

        res.render('admin/caregiver-detail', {
            user: req.session.user,
            admin: {
                name: req.session.user.nama,
                role: req.session.user.role
            },
            caregiver,
            adminBasePath: '/admin'
        });

    } catch (error) {
        console.error('[CAREGIVER DETAIL ERROR]', error);
        res.status(500).send('Gagal memuat detail caregiver.');
    }
}


// Menampilkan form edit caregiver
async function editForm(req, res) {
    try {
        const caregiver = await CaregiverModel.getById(req.params.id);

        if (!caregiver) {
            return res.status(404).send('Caregiver tidak ditemukan.');
        }

        res.render('admin/caregiver-form', {
            user: req.session.user,
            admin: {
                name: req.session.user.nama,
                role: req.session.user.role
            },
            mode: 'edit',
            caregiver,
            errors: {},
            adminBasePath: '/admin'
        });

    } catch (error) {
        console.error('[CAREGIVER EDIT ERROR]', error);
        res.status(500).send('Gagal memuat form edit caregiver.');
    }
}

// Memproses perubahan data caregiver
async function update(req, res) {
    try {
        const {
            fullName,
            email,
            phone,
            address,
            status
        } = req.body;

        const id = req.params.id;

        if (!fullName || !email) {
            return res.status(400).send('Nama dan email wajib diisi.');
        }

        const caregiver = await CaregiverModel.getById(id);

        if (!caregiver) {
            return res.status(404).send('Caregiver tidak ditemukan.');
        }

        const UserModel = require('../models/UserModel');
        const existingUser = await UserModel.findByEmail(email);

        if (existingUser && Number(existingUser.id) !== Number(id)) {
            return res.status(400).send('Email sudah digunakan.');
        }

        await CaregiverModel.update(id, {
            fullName,
            email,
            phone: phone || null,
            address: address || null,
            status: status || 'active'
        });

        res.redirect(`/admin/caregivers/${id}`);

    } catch (error) {
        console.error('[CAREGIVER UPDATE ERROR]', error);
        res.status(500).send('Gagal memperbarui caregiver.');
    }
}


 // Menghapus caregiver
async function destroy(req, res) {
    const db = require('../config/database');

    let connection;

    try {
        const id = req.params.id;

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Pastikan akun benar-benar caregiver
        const [caregivers] = await connection.execute(
            `SELECT id FROM users WHERE id = ? AND role = 'caregiver'`,
            [id]
        );

        if (caregivers.length === 0) {
            await connection.rollback();
            return res.status(404).send('Caregiver tidak ditemukan.');
        }

        // Hapus penugasan caregiver
        await connection.execute(
            `DELETE FROM care_assignments WHERE caregiver_id = ?`,
            [id]
        );

        // Hapus akun caregiver
        await connection.execute(
            `DELETE FROM users WHERE id = ? AND role = 'caregiver'`,
            [id]
        );

        await connection.commit();

        res.redirect('/admin/caregivers');

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error('[CAREGIVER DELETE ERROR]', error);
        res.status(500).send('Gagal menghapus caregiver.');

    } finally {
        if (connection) {
            connection.release();
        }
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