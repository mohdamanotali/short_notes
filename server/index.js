const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rnmappdb'
});

app.listen(3001, () => {
    console.log("it's running on port 3001 now");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get(['/', '/api'], (req, res) => {
    res.send("it's an invalid url");
});

app.get('/api/read', (req, res) => {
    const _read = "SELECT id, title, description, color, updated_at FROM notes WHERE status = ? ORDER BY updated_at DESC";
    db.query(_read, 1, (error, results, fields) => {
        if (error) res.send({status: 500, message: 'Error has occurred'});
        else res.send({status: 200, records: results});
    });
});

app.post('/api/create', (req, res) => {
    const _title = req.body.title;
    const _description = req.body.description;
    const _color = req.body.color;

    if (_title && _description && _color) {
        const _create = "INSERT INTO notes (title, description, color) VALUES (?, ?, ?)";
        db.query(_create, [_title, _description, _color], (error, results, fields) => {
            if (error) res.send({status: 500, message: 'Error has occurred'});
            else res.send({status: 200, message: 'Note is created'});
        });
    } else {
        res.send({status: 400, message: 'Invalid input(s)'});
    }
});

app.put('/api/update', (req, res) => {
    const _id = req.body.id;
    const _title = req.body.title;
    const _description = req.body.description;
    const _color = req.body.color;

    if (_id && _title && _description && _color) {
        const _create = "UPDATE notes SET title = ?, description = ?, color = ? WHERE id = ?";
        db.query(_create, [_title, _description, _color, _id], (error, results, fields) => {
            if (error) res.send({status: 500, message: 'Error has occurred'});
            else res.send({status: 200, message: 'Note is updated'});
        });
    } else {
        res.send({status: 400, message: 'Invalid input(s)'});
    }
});

app.delete('/api/delete/:id/:status', (req, res) => {
    const _id = req.params.id;
    const _status = req.params.status;
    const _stature = _status==1 ? _status : 0;

    if (_id) {
        const _delete = "UPDATE notes SET status = ? WHERE id = ?";
        db.query(_delete, [_stature, _id], (error, results, fields) => {
            if (error) res.send(error);
            else res.send({status: 200, message: _stature==1 ? 'Note is recovered' : 'Note is deleted'});
        });
    } else {
        res.send({status: 400, message: 'Invalid input(s)'});
    }
});
