const express = require('express');

const db = require('../service/connection');

const router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/posts');
});

router.get('/posts', async function(req, res) {
    const query = `
        SELECT "Appointment".date, "Appointment".time, "Procedure".procedure_name, "Person".surname, "Person".first_name
        FROM "Appointment" 
        INNER JOIN "Procedure" ON "Appointment".procedure_id = "Procedure".procedure_id 
        INNER JOIN "Doctor" ON "Appointment".doctor_id = "Doctor".doctor_id 
        INNER JOIN "Person" ON "Doctor".cnp = "Person".cnp;
    `;
    const [appointments] = await db.query(query);
    res.render('posts-list', { appointments: appointments});
});

router.get('/new-post', async function(req, res) {
    const procedures = await db.query('SELECT * FROM public."Procedure" ORDER BY procedure_name ASC ');
    const query = `
        SELECT  public."Doctor".doctor_id, public."Person".surname, public."Person".first_name 
        FROM public."Doctor" 
        INNER JOIN public."Person" ON public."Doctor".cnp = public."Person".cnp;
    `;
    const doctors = await db.query(query);
    res.render('create-post', { doctors: doctors, procedures: procedures});
});

router.get('/posts/:id', async function(req, res) {
    const query = `
    SELECT "Appointment".date, "Appointment".appointment_id, "Appointment".time, "Procedure".procedure_name, "Person".surname, "Person".first_name, "Appointment".text
    FROM "Appointment" 
    INNER JOIN "Procedure" ON "Appointment".procedure_id = "Procedure".procedure_id 
    INNER JOIN "Doctor" ON "Appointment".doctor_id = "Doctor".doctor_id 
    INNER JOIN "Person" ON "Doctor".cnp = "Person".cnp;
    WHERE appointment_id = 34
    `;
    const [appointments] = await db.query(query, [req.params.appointment_id]);
    if(!posts || posts.length===0) {
        res.status(404).render('404');
    }
    res.render('post-detail', {appointment: appointments[0]});
});

router.post('/posts', async function(req, res) {
    const data = [
        4,
        parseInt(req.body.doctor),
        req.body.date,
        req.body.time,
        parseInt(req.body.procedure),
        req.body.text,
    ];
    console.log(data);
    await db.query(`INSERT INTO public."Appointment"(patient_id, doctor_id, date, time, procedure_id, text) 
                    VALUES (${data[0]}, ${data[1]}, '${data[2]}', '${data[3]}', ${data[4]}, '${data[5]}');`);
    res.redirect('/posts');
});

router.get('/posts/:id/edit', function(req,res) {
    res.render('update-post');
});

module.exports = router;