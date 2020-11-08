const fs = require('fs');

const data = {
  "firstName": "Joshie",
  "lastName": "Wyattson",
  "county": "San Mateo",
  "city": "San Mateo",
  "role": "Broker",
  "sales": 1000000,
  "children": [
    {
      "firstName": "Beth Jr.",
      "lastName": "Johnson",
      "county": "San Mateo",
      "city": "Pacifica",
      "role": "Manager",
      "sales": 2900000,
      "children": [
        {
          "firstName": "Smitty",
          "lastName": "Won",
          "county": "San Mateo",
          "city": "Redwood City",
          "role": "Sales Person",
          "sales": 4800000,
          "children": []
        },
        {
          "firstName": "Allen",
          "lastName": "Price",
          "county": "San Mateo",
          "city": "Burlingame",
          "role": "Sales Person",
          "sales": 2500000,
          "children": []
        }
      ]
    },
    {
      "firstName": "Beth",
      "lastName": "Johnson",
      "county": "San Francisco",
      "city": "San Francisco",
      "role": "Broker/Sales Person",
      "sales": 7500000,
      "children": []
    }
  ]
};

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
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += rows;
  return csvContent;
};

let result = formatData(data);
const info = applyBoundary(result)
const csv = writeCSV(info);
console.log();

