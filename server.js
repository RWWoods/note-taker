const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/notes/', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            throw err
        } else {
            res.status(200).json(JSON.parse(data))
        }
    })
    console.info(`${req.method} request received to get notes`);
})


app.post('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} request received to add a note`);
    // console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid()
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                throw err
            } else{
                let parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) =>
                writeErr ? console.error(writeErr) : console.info("successful update"))
            }
        })

    } else {
        res.error(`error adding note`)
    }
})

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));