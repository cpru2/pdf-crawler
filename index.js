const tabula = require('tabula-js');
const _ = require('highland');
const fs = require('fs');

var pdfs = ['codeup_late2016.pdf', 'dev_code_camp_2016.pdf', 'hack_reactor_new_york.pdf'];
// var readFile = _.wrapCallback(fs.readFile);
// var arrayLength = pdfs.length
// var pdf = 'codeup_late2016.pdf';

// function for setting area and columns from the command line?

function getData(pdf) {
  // create streams as constants
  let i = tabula(pdf, {area: '53.08, 0, 161.25, 611.06', columns: '428.96'}).streamCsv();
  let ii = tabula(pdf, {area: '161.29, 0, 211.43, 611.06'}).streamCsv();
  let iii = tabula(pdf, {area: '210.37, 0, 252.84, 611.06', columns: '428.96'}).streamCsv();
  let iv = tabula(pdf, {area: '253.11, 0, 571.48, 611.06', columns: '428.96, 495.33'}).streamCsv();
  let v = tabula(pdf, {area: '571.16, 0, 655.04, 611.06', columns: '428.96'}).streamCsv();
  let vi = tabula(pdf, {area: '654.83, 0, 669.04, 611.06', columns: '428.96'}).streamCsv();
  let report = _([i, ii, iii, iv, v, vi]).parallel(6);
  var file = pdf.replace('pdf', 'csv');
  report
  .errors(function (err, push) {
        console.log('Caught error:', err.message);
  }).pipe(fs.createWriteStream(file));
  /*
  // let file = pdf.replace('pdf', 'csv');
  let file = pdf.replace('pdf', 'csv');
  let summary = fs.createWriteStream(file);
  report
  .pipe(summary);
  */
}

function writeData() {
  pdfs.forEach(function (element) {
    getData(element);
  });
}

writeData();

// writeData();

// next thing on this for "reading file"
// some sort of iterator that gets stream in a series, one after the other

  /*
let file = pdf.replace('pdf', 'csv');
let summary = fs.createWriteStream(file);
report
.pipe(summary);
*/

  // let school = tabula('codeup_late2016.pdf', {area: '68.1, 430.17, 80.71, 561.95'}).streamCsv()
  // let program = tabula('codeup_late2016.pdf', {area: '106.46, 430.17, 120.55, 561.95'}).streamCsv()
  // how to get rid of spaces and new lines, how to print repr or ?
  // create generator to produce streams
  // let stream = school.streamCsv()
  // merge stream of streams with
  // we might be able to map these strings to a function that removes new lines and adds commas
  // let stream = _([school, program]).merge();
  // let program_string = program.streamCsv();
  // create an array of values
  // let stream = _([school_string, program_string])
  // map these values to a single stream
  // var streams = stream.map(function (x) {
      // return x + ', ';
    // xs will be [['foo', 'bar']]
  // });
  // write stream to summary.csv

  // console.log(stream)
  // .done(() => console.log('ALL DONE!'));
  // consume streams in array
  // stream = _([school_string]).pipe(fs.createWriteStream('summary.csv'));
  // return stream
  // console.log(school_string)
  // => ['Codeup', '']['Full-stack Web Development']

  // }
// }
// how does extractCsv actually work, can we store as a variable? Is it a string, array?
// what does a csv file need to look like? do we write arrays to it?
// takes in arrays? and outputs single line
// what do we want transform data to do? output a single line of a csv file

// create read stream
// newstream
// .pipe(fs.createWriteStream('summary.csv'));
// var summary = fs.createWriteStream('summary.csv')
// data.pipe('summary');
// .doto(console.log)
// .done(() => console.log('ALL DONE!'));
// const stream = _(school)
// console.log(stream)
// var output = fs.createWriteStream('output');
/*_([stream, stream2]).toArray(function (xs) {
    console.log(xs); // => [1, 2]
});*/
// .pipe(fs.createWriteStream('codeup_late2016.csv'));
// extract data from CSV
// school.extractCsv((err, data) => console.log(data));
// program.extractCsv((err, data) => console.log(data));
// get 1st item in list/array
// create dict {school: 'codeup', program: 'full-stack web development'}
// store dict as array of items
// write dict to output
// or..
// get items as array and write to CSV stream
//const stream = tabula('codeup_late2016.pdf', {area: '253.11, 0, 571.48, 611.06', columns: "428.96, 495.33"}).streamCsv();
//stream
//.pipe(fs.createWriteStream('codeup_late2016.csv'));
