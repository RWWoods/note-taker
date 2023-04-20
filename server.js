const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json" , "utf-8", (err, data) =>
    {if (err) {
        throw err}
        res.status(200).json(JSON.parse (data))
    })
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    console.info (`${req.method} request received to get notes`);
})

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };


app.post('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} request received to add a note`);
    console.info (`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuid()
        };
        readAndAppend(newTip, './db/db.json');
        res.json(`note added successfully`)
    } else {
        res.error(`error adding note`)
    }
})




app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));