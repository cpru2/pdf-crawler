// purpose is to crawl websites , grab all pdfs, and return them in an array
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('highland');
var index = require('./index');

// write an export as a class for all functions, follow example of index.js

function crawl() {
  var pageToVisit = 'https://cirr.org/data';
  console.log('Visiting page ' + pageToVisit);
  request(pageToVisit, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }
    // check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    if(response.statusCode === 200) {
      // Parse the document body
      var $ = cheerio.load(body);
      console.log("Page title: " + $('title').text());
      var arr = collectInternalLinks($);
      getPdfs(arr);
      index().iterPdf();
    }
  });
}

function collectInternalLinks($) {
  var allAbsoluteLinks = [];
  var absoluteLinks = $("a[href^='http']");
  absoluteLinks.each(function () {
    allAbsoluteLinks.push($(this).attr('href'));
  });
  console.log("Found " + allAbsoluteLinks.length + " absolute links");
  return allAbsoluteLinks;
}

function getPdfs(arr) {
  // var links = [];
  if (!fs.existsSync('data_pdf')) {
      fs.mkdirSync('data_pdf');
  };
  arr.forEach( function(element) {
    if (element.includes('pdf')) {
      var re = new RegExp('.*\.com\/');
      let name = element.replace(re, '');
      let file = 'data_pdf/' + name;
      // links.push(file);
      var fileStream = fs.createWriteStream(file);
      request(element).pipe(fileStream);
    };
  });
  // return links;
};

crawl();
