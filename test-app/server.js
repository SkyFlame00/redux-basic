const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('dist'));

app.get('/', (req, res) => {
  fs.readFile('dist/files.html', 'utf-8', (err, file) => {
    if (err)
      res.status(404).end('Error occured');

    res.status(200).end(file);
  });
});

app.listen(8081, () => console.log('Listening on port 8081'));