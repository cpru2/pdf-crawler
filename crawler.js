// purpose is to crawl websites , grab all pdfs, and return them in an array
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs')
// var index = require('index');

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
    convertCsv(arr);
  }
});

function collectInternalLinks($) {
  var allAbsoluteLinks = [];
  var absoluteLinks = $("a[href^='http']");
  absoluteLinks.each(function () {
    allAbsoluteLinks.push($(this).attr('href'));
  });
  console.log("Found " + allAbsoluteLinks.length + " absolute links");
  return allAbsoluteLinks;
}

function convertCsv(arr) {
  var pdfs = [];
  arr.forEach( function(element) {
    if (element.includes('pdf')) {
      let name = element.replace('https://f7eea198803e20f1a6cb-cd07fb533ce2420564de815633c944f7.ssl.cf2.rackcdn.com/', '');
      var pdf = request(element).pipe(fs.createWriteStream(name));
      pdfs.push(pdf);
    };
  });
  return pdfs;
}
