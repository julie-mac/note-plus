const express = require('express');
const uniqid = require('uniqid');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001

const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Serving up the public folder
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', function(error, data) {
        const parsedData = JSON.parse(data);
        console.log(data);
        console.log(parsedData);
        res.json(parsedData);
    });
})

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uniqid()
        }
        fs.readFile('./db/db.json', 'utf8', function(error, data) {
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);
            const jsonData = JSON.stringify(parsedData);

            fs.writeFile('./db/db.json', (jsonData), (err) => {
                err
                    ? console.error(err)
                    : console.log(`Your note has been added successfully.`)
            })
        });
        const response = {
            status: 'success',
            body: newNote,
          };
      
          console.log(response);
          res.status(201).json(response);

    } else {
		res.status(500).json('Please make sure to include both a title and description.')
    }
    
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
  