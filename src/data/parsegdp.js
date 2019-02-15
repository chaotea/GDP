/*  parsegdp.js
Parse through raw data from World Bank and convert it into json
Columns [59]: Years from 1960 to 2018
Rows [265]: header row + 264 countries 
*/

const fs = require("fs")

var data = {}

var rawData = fs.readFileSync("GDPWorldBank.csv", "UTF8").split("\r\n")
rawData.forEach(function(line, index) {
	line = line.slice(1, -2).split("\",\"")  // Trim initial " and trailing ", and split
	let name = (index == 0 ? "Year" : line[0])
	let rowData = line.slice(4).map(function(element) {  // Convert elements to integers
		parsed = parseInt(element, 10)
		if (isNaN(parsed)) {
			return null
		} else {
			return parsed
		}
	})
	data[name] = rowData
})

var json_data = JSON.stringify(data, null, "\t")

fs.writeFileSync("data.json", json_data, "UTF8")