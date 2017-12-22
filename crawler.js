// purpose is to crawl websites , grab all pdfs, and return them in an array
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('highland');
const tabula = require('tabula-js');

// don't really understand what this is doing - how to get just pdfs?
var getLinks = function getLinks(x) {
  var attr = "a[href^='http']";
  var absoluteLinks = x(attr);
  var allAbsoluteLinks = [];
  absoluteLinks.each(function () {
    allAbsoluteLinks.push(x(this).attr('href'));
    // need to just add those with .pdf
  });
  console.log("Found " + allAbsoluteLinks.length + " absolute links");
  return allAbsoluteLinks;
}

var readData = function readData(dir) {
  var arr = fs.readdirSync(dir);
  arr.forEach( function(x) {
    let path = dir + '/' + x;
    let newDir = 'data_csv';
    if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir);
    };
    let newFile = x.replace('pdf', 'csv');
    let newPath = newDir + '/' + newFile;
    // create streams as constants
    let i = tabula(path, {area: '53.08, 0, 161.25, 611.06', columns: '428.96'}).streamCsv();
    let ii = tabula(path, {area: '161.29, 0, 211.43, 611.06'}).streamCsv();
    let iii = tabula(path, {area: '210.37, 0, 252.84, 611.06', columns: '428.96'}).streamCsv();
    let iv = tabula(path, {area: '253.11, 0, 571.48, 611.06', columns: '428.96, 495.33'}).streamCsv();
    let v = tabula(path, {area: '571.16, 0, 655.04, 611.06', columns: '428.96'}).streamCsv();
    let vi = tabula(path, {area: '654.83, 0, 669.04, 611.06', columns: '428.96'}).streamCsv();
    let report = _([i, ii, iii, iv, v, vi]).parallel(6);
    report
    .errors(function (err, push) {
          console.log('Caught error:', err.message);
    }).pipe(fs.createWriteStream(newPath));
  });
}


function crawl(url, f) {
  // var pageToVisit = 'https://cirr.org/data';
  console.log('Visiting page ' + url);
  request(url, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }
    // check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    if(response.statusCode === 200) {
      // Parse the document body
      var $ = cheerio.load(body);
      console.log("Page title: " + $('title').text());
      var arr = f($);
      requestPdfs(arr);
      console.log("PDF's in directory, data_pdf");

    }
  });
}

// request pdfs, stream and write to csv file
function requestPdfs(arr) {
  arr.forEach( function(x) {
    if (x.includes('pdf')) {
      let dir = 'data_pdf';
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      };
      var re = new RegExp('.*\.com\/');
      let file = x.replace(re, '');
      let path = dir + '/' + file;
      // links.push(file);
      let fileStream = fs.createWriteStream(path);
      request(x).pipe(fileStream);
    }
  });
}


crawl('https://cirr.org/data', getLinks);
