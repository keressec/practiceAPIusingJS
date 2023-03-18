const express = require('express');
const res = require('express/lib/response');
const students = require('./students');
const app = express();

//Middleware untuk parsing body request
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//redirect dari http://localhost:3000/ ke http://localhost:3000/students/show
app.get('/', (req, res) => {
    res.redirect('/students/show');
});

//GET /students/show endpoint, untuk melihat data semua mahasiswa
app.get('/students/show', (req, res) => {
    res.json(students);
});

//GET /students/:id/show endpoint, untuk melihat data mahasiswa berdasarkan ID
app.get('/students/:id/show', (req, res) => {
    const id = parseInt(req.params.id);

    //agar tidak menghasilkan konflik dengan variabel students yang didefinisikan di level file.
    const student = students.find((s) => s.id === id);
    
    if (!student) {
        res.status(404).send('Student not found');
        return;
    }

    res.json(student);
});

//POST /students/add endpoint, untuk menambahkan mahasiswa baru
app.post('/students/add', (req, res) => {
    const {name, major} = req.body;
    
    if (!name || !major) {
        res.status(400).send('Name and major are required');
        return;
    }
    //Periksa apakah mahasiswa dengan nama yang sama sudah ada
    const existingStudent = students.find((student) => student.name === name);
    if (existingStudent) {
        res.status(400).send('A student with the same name already exists');
        return;
    }
    //Tambahkan mahasiswa baru ke array students
    const newStudent = { id: students.length +1, name, major};
    students.push(newStudent);

    //Kirim response dengan kode status 201 Created
    res.status(201).json(newStudent);
});

//PUT /students/:id/update endpoint, untuk mengupdate data mahasiswa berdasarkan ID
app.put('/students/:id/update', (req, res) =>{
    const id = parseInt(req.params.id);
    const {name, major } = req.body;
    
    if (!name || !major){
        res.status(400).send('Name and major are required');
        return;
    }

    let student = students.find((s)=> s.id === id);
    
    if (!student) {
        res.status(404).send('Student not found');
        return;
    }

    student.name = name || student.name;
    student.major = major || student.major;

    res.status(200).json(student);

});

// DELETE /students/:id/delete endpoint, untuk menghapus data mahasiswa berdasarkan ID
app.delete('/students/:id/delete', (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex((s) => s.id = id);
    if (index === -1){
        res.status(404).send('Student not found');
        return
    }
    students.splice(index, 1);

    res.send(`Student with ID ${id} has been deleted`);
});

//Menjalankan server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});