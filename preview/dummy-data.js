// DATA DUMMY - hanya untuk preview lokal. Bentuk datanya = kontrak variabel di docs/INTEGRASI.md.
const caregivers = [
  { id: 1, fullName: 'Rina Wulandari',  email: 'rina.wulandari@careconnect.id', phone: '081234560001', address: 'Jl. Melati No. 12, Denpasar',         status: 'active' },
  { id: 2, fullName: 'Budi Santoso',    email: 'budi.santoso@careconnect.id',   phone: '081234560002', address: 'Jl. Kenanga No. 5, Badung',          status: 'active' },
  { id: 3, fullName: 'Ayu Pratiwi',     email: 'ayu.pratiwi@careconnect.id',    phone: '081234560003', address: 'Jl. Mawar No. 8, Gianyar',           status: 'active' },
  { id: 4, fullName: 'Dewi Lestari',    email: 'dewi.lestari@careconnect.id',   phone: '081234560004', address: 'Jl. Anggrek No. 21, Tabanan',        status: 'inactive' },
  { id: 5, fullName: 'Made Wirawan',    email: 'made.wirawan@careconnect.id',   phone: '081234560005', address: 'Jl. Teuku Umar No. 40, Denpasar',    status: 'active' }
];
const R = (id, fullName, birthDate, gender, address, phone, fam, famPhone, cg) => {
  const age = Math.floor((new Date('2026-11-09') - new Date(birthDate)) / 31557600000);
  const c = cg ? caregivers.find(x => x.id === cg) : null;
  return { id, fullName, birthDate, age, gender, address, phone, familyContactName: fam, familyContactPhone: famPhone,
    caregiver: c ? { id: c.id, fullName: c.fullName, phone: c.phone } : null };
};
const residents = [
  R(1, 'Wayan Sudarma',     '1946-03-12', 'L', 'Jl. Raya Dalung No. 17, Kuta Utara',   '0361900101', 'Komang Sudarma',   '081900000101', 1),
  R(2, 'Ni Ketut Sari',     '1950-07-25', 'P', 'Jl. Imam Bonjol No. 88, Denpasar',     '',           'Putu Ardana',      '081900000102', 1),
  R(3, 'Hasan Basri',       '1944-11-02', 'L', 'Jl. Gatot Subroto Timur No. 3',        '0361900103', 'Rahma Basri',      '081900000103', 2),
  R(4, 'Siti Aminah',       '1948-01-30', 'P', 'Jl. Sunset Road No. 54, Kuta',         '0361900104', 'Yusuf Aminah',     '081900000104', 2),
  R(5, 'Gede Mahendra',     '1952-09-09', 'L', 'Jl. Tegal Sari No. 9, Denpasar Barat', '',           'Luh Mahendra',     '081900000105', 3),
  R(6, 'Margaretha Lim',    '1945-05-18', 'P', 'Jl. Teuku Umar Barat No. 101',         '0361900106', 'Daniel Lim',       '081900000106', 3),
  R(7, 'Nyoman Artha',      '1949-12-04', 'L', 'Jl. Pulau Misol No. 6, Denpasar',      '0361900107', 'Kadek Artha',      '081900000107', 5),
  R(8, 'Kartini Dewi',      '1951-04-21', 'P', 'Jl. Bypass Ngurah Rai No. 230',        '',           'Agus Kartini',     '081900000108', 5),
  R(9, 'Slamet Raharjo',    '1943-08-15', 'L', 'Jl. Diponegoro No. 72, Denpasar',      '0361900109', 'Sri Raharjo',      '081900000109', 1),
  R(10, 'Ni Luh Putu Ayu',  '1947-02-27', 'P', 'Jl. Cokroaminoto No. 14, Denpasar',    '0361900110', 'Wayan Surya',      '081900000110', null),
  R(11, 'Ahmad Dahlan',     '1946-10-10', 'L', 'Jl. Kediri No. 33, Tabanan',           '',           'Fatimah Dahlan',   '081900000111', null),
  R(12, 'Theresia Maria',   '1950-06-06', 'P', 'Jl. Raya Sesetan No. 58, Denpasar',    '0361900112', 'Paulus Maria',     '081900000112', null)
];
caregivers.forEach(c => { c.residentCount = residents.filter(r => r.caregiver && r.caregiver.id === c.id).length; });
const assignments = residents.filter(r => r.caregiver).map((r, i) => ({
  id: i + 1, residentId: r.id, residentName: r.fullName, caregiverId: r.caregiver.id, caregiverName: r.caregiver.fullName,
  assignedAt: `2026-${String(8 + (i % 3)).padStart(2, '0')}-${String(3 + i * 2).padStart(2, '0')}`
}));
const unassignedResidents = residents.filter(r => !r.caregiver);
const stats = {
  totalResidents: residents.length, totalCaregivers: caregivers.length,
  assignedResidents: assignments.length, unassignedResidents: unassignedResidents.length
};
const recentActivities = [
  { type: 'medication', title: 'Minum obat tekanan darah',      residentName: 'Wayan Sudarma',  caregiverName: 'Rina Wulandari', createdAt: '2026-11-09T08:15:00' },
  { type: 'vital',      title: 'Cek tekanan darah 128/82',      residentName: 'Hasan Basri',    caregiverName: 'Budi Santoso',   createdAt: '2026-11-09T07:50:00' },
  { type: 'meal',       title: 'Sarapan bubur ayam habis',      residentName: 'Margaretha Lim', caregiverName: 'Ayu Pratiwi',    createdAt: '2026-11-09T07:30:00' },
  { type: 'medication', title: 'Minum vitamin dan obat gula',   residentName: 'Siti Aminah',    caregiverName: 'Budi Santoso',   createdAt: '2026-11-09T07:05:00' },
  { type: 'vital',      title: 'Cek gula darah 142 mg/dL',      residentName: 'Nyoman Artha',   caregiverName: 'Made Wirawan',   createdAt: '2026-11-08T19:40:00' }
];
const recentAlerts = [
  { level: 'high',   message: 'Tekanan darah 165/100 melebihi batas', residentName: 'Slamet Raharjo', createdAt: '2026-11-09T08:02:00', status: 'open' },
  { level: 'medium', message: 'Obat siang belum dikonfirmasi',        residentName: 'Kartini Dewi',   createdAt: '2026-11-08T14:20:00', status: 'open' },
  { level: 'low',    message: 'Belum ada catatan aktivitas 24 jam',   residentName: 'Gede Mahendra',  createdAt: '2026-11-08T09:00:00', status: 'open' }
];
const admin = { name: 'Admin CareConnect', role: 'Administrator' };
const common = { admin, alertCount: 3 };

module.exports = { caregivers, residents, assignments, unassignedResidents, stats, common, recentActivities, recentAlerts };
