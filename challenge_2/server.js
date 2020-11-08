const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/sendData', (req, res, next) => {
  const { data } = req.body;
  const parsed = JSON.parse(data);
  const [headers, values] = formatData(parsed);
  const bound = applyBoundary([headers, values]);
  const csv = writeCSV(bound);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.status(200).send(csv);
});


const formatData = (data) => {
  const headers = [];
  const values = [];

  const transform = (obj) => {
    for (let key in obj) {
      if (!(obj[key] instanceof Object)) {
        if (!headers.includes(key)) {
          headers.push(key);
        }
        values.push(obj[key]);
      } else {
        transform(obj[key]);
      }
    }
  };
  transform(data);
  return [headers, values];
};

const applyBoundary = ([headers, values]) => {
  const tempData = headers.join(',');
  let rawValues = '';
  let counter = 0
  for (let current = 0; current < values.length; current++) {
    if (typeof values[current - 1] !== 'number') {
      rawValues += `${values[current]},`;
    } else {
      rawValues += `\n${values[current]},`;
    }
  }
  rawValues = rawValues.slice(0, rawValues.length - 1);
  return { headers, rows: rawValues };
};

const writeCSV = ({ headers, rows }) => {
  let csvContent = headers + '\n' + rows;
  return csvContent;
};

const port = 3000;

app.listen(port, () => {
  console.log('I\'m up on port ' + port);
});
