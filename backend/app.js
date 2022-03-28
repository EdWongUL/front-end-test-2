// SERVER sends responses based on each LETTER that is input
//

const express = require("express");
const cors = require("cors");
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fs = require("fs");

const app = express();
app.use(cors());

const port = 3500;

const numberOfCards = 3;

// Reading timezone xml
const parser = new XMLParser();
const timezoneData = fs.readFileSync("timezone.xml").toString();
const fullData = parser.parse(timezoneData).TimeZones.TimeZone;

let formattedData = [];

for (let i = 0; i < fullData.length; i++) {
  const row = fullData[i].Name.split(",");
  for (let j = 0; j < row.length; j ++) {
    // check if it's the last one, if it is, cut the last 9 characters off (timezone is appended on this).
      let current = row[j];
      if (j === row.length-1) {
        current = current.slice(0, current.length-9);
      }

      currentTimezone = fullData[i].Hours + (fullData[i].Mins / 60);
      formattedData.push({name: current.trim(), timezone: currentTimezone})
  }
}

console.log(formattedData);

app.use(express.static("/public"));

app.get("/:search", (req, res) => {
  const searchTerm = req.params.search;
  const result = formattedData
    .filter((data) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, numberOfCards);
  console.log(`search: ${searchTerm}, sending results:`);
  console.log(result);
  res.send(result);
});

app.get("/", (req, res) => {
  const result = formattedData.slice(0, numberOfCards);
  console.log(`search is empty, sending results:`);
  console.log(result);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
