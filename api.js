const client = require('./service/connection')
const express = require('express');
const app = express();
const path = require('path');

const blogRoutes = require('./routes/appointment');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static('public')); // Serve static files (e.g. CSS files)

app.use(blogRoutes);

app.listen(3333, ()=>{
    console.log("Server is now listening at port 3333");
})

app.get('/City', (req, res)=>{
    client.query(`Select * from "City"`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.get('/City/:zip', (req, res)=>{
    console.log(req.params.zip);
    client.query(`Select * from "City" where zip=${req.params.zip}`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.post('/City', (req, res)=> {
    const City = req.body;
    let insertQuery = `insert into "City" (zip, city) 
                       values(${City[0].zip}, '${City[0].city}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

app.put('/City/:zip', (req, res)=> {
    let City = req.body;
    let zip_code = req.params.zip;
    let updateQuery = `update "City"
                       set city = '${City[0].city}'
                       where zip = ${zip_code}`

    client.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

app.delete('/City/:zip/delete', (req, res)=> {

    let insertQuery = `delete from "City" where zip='${req.params.zip}'`
    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Deletion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

//https://www.cssscript.com/minimal-inline-calendar-date-picker-vanilla-javascript/

client.connect();

// export default {
//     create: {
//         post
//     }
//     ,read: {
//         get
//     }
//     // ,delete: {
//     //     delete
//     // }
//     ,update: {
//         put
//     }
// }