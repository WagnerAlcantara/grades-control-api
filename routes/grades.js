var express = require('express');
var fs = require('fs');
var router = express.Router();

router.post('/', (req, res) => {
  let grade = req.body;
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) {
        throw err;
      }
      let json = JSON.parse(data);

      let lastNumber = 0;
      grade.grades = grade.grades.map((grade) => {
        ++json.nextId;
        grade.id = json.nextId;
        lastNumber = grade.id;
        return grade;
      });
      json.grades = json.grades.concat(grade.grades);
      json.nextId = lastNumber;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/', (_, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) {
        throw err;
      }
      let json = JSON.parse(data);
      delete json.nextId;
      res.send(json);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});
router.get('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) {
        throw err;
      }
      let json = JSON.parse(data);
      // prettier-ignore
      const grade = json.grades.find(grade => grade.id === parseInt(req.params.id, 10));
      if (grade) {
        res.send(grade);
      } else {
        res.end();
      }

      res.send(grade);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});
router.delete('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      let json = JSON.parse(data);
      // prettier-ignore
      let grades = json.grades.filter(grade => grade.id !== parseInt(req.params.id, 10));
      json.grades = grades;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.put('student', (req, res) => {
  let newGrade = {
    id: parseInt(req.params.id, 10),
    student: req.body,
  };

  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) {
        throw err;
      }

      let json = JSON.parse(data);
      // prettier-ignore
      let oldIndex = json.grades.findIndex(grade => grade.id === newGrade.id);
      json.grades[oldIndex].student = newGrade.student.student;
      json.grades[oldIndex].subject = newGrade.student.subject;
      json.grades[oldIndex].type = newGrade.student.type;
      json.grades[oldIndex].value = newGrade.student.value;

      // prettier-ignore
      fs.writeFile(global.fileName, JSON.stringify(json), err => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});
router.get('/:subject/:type', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) {
        throw err;
      }
      let json = JSON.parse(data);
      let grades = json.grades;
      let newGrade = {
        subject: req.params.subject,
        type: req.params.type,
      };

      let media = 0;
      let count = 0;
      let soma = 0;
      for (let i = 0; i < grades.length; i++) {
        const element = grades[i];
        if (
          element.subject == newGrade.subject &&
          element.type == newGrade.type
        ) {
          //    countStudent.push(element);
          count += 1;
          soma += element.value;
          media = soma / count;
        }
      }
      res.status(200).send({
        media: media,
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/search/:subject/:type', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) {
        throw err;
      }
      let json = JSON.parse(data);
      let grades = json.grades;
      let newGrade = {
        subject: req.params.subject,
        type: req.params.type,
      };
      let search = [];
      let result = [];
      grades.forEach((element) => {
        if (
          element.subject == newGrade.subject &&
          element.type == newGrade.type
        ) {
          search.push(element);
        }
      });
      search.sort(function (a, b) {
        return b.value - a.value;
      });
      for (let i = 0; i < 3; i++) {
        result.push(search[i]);
      }

      res.status(200).send({
        result,
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/notas/:student/:subject', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) {
        throw err;
      }
      let json = JSON.parse(data);
      let grades = json.grades;
      let newGrade = {
        student: req.params.student,
        subject: req.params.subject,
      };
      //let countStudent = [];
      let somaNotas = 0;
      for (let i = 0; i < grades.length; i++) {
        const element = grades[i];
        if (
          element.student == newGrade.student &&
          element.subject == newGrade.subject
        ) {
          //    countStudent.push(element);
          somaNotas += element.value;
        }
      }
      res.status(200).send({
        somaDaNota: somaNotas,
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

module.exports = router;
