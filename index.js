const express = require('express');
const fs = require('fs');
const gradesRouter = require('./routes/grades.js');
global.fileName = 'grades.json';
app = express();

app.use(express.json());
app.use('/grade', gradesRouter);

app.listen(2000, function () {
  try {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
      if (err) {
        const initialJson = {
          nextId: 1,
          grades: [],
        };
        fs.writeFile(global.fileName, JSON.stringify(initialJson), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
  console.log('API STARTED');
});
