const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this reads our notes database when on the right url to load any notes that are saved for the user to see
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

// this reads the contents (body) of a new note being written to db.json and writes it to the page
app.post('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} request received to add a note`);


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
            } else {
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
// this delete request allows the user to use the trashcan icon to remove a note from the list.
app.delete('/api/notes/:id', (req, res) => {
    const deleteId = req.params.id;


    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err
        } else {
            let parsedNotes = JSON.parse(data);
            const arrayId = parsedNotes.filter(note => note.id != deleteId)
           

            fs.writeFile('./db/db.json', JSON.stringify(arrayId, null, 4), (writeErr) =>
                writeErr ? console.error(writeErr) : res.json(JSON.stringify(arrayId)))
        }

    })


})

// these get requests send responses on what html page will load based on url.
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// sets server to 'live' basically to respond to requests
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));