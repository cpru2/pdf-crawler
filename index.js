const tabula = require('tabula-js');
const _ = require('highland');
const fs = require('fs');

module.exports = Transform;

function Transform(x) {
  if (!(this instanceof Transform)) return new Transform(x);
  this.x = x;
}

Transform.prototype.readData = function() {
  if (!fs.existsSync('data_csv')) {
      fs.mkdirSync('data_csv');
  };
  // create streams as constants
  let i = tabula(this.x, {area: '53.08, 0, 161.25, 611.06', columns: '428.96'}).streamCsv();
  let ii = tabula(this.x, {area: '161.29, 0, 211.43, 611.06'}).streamCsv();
  let iii = tabula(this.x, {area: '210.37, 0, 252.84, 611.06', columns: '428.96'}).streamCsv();
  let iv = tabula(this.x, {area: '253.11, 0, 571.48, 611.06', columns: '428.96, 495.33'}).streamCsv();
  let v = tabula(this.x, {area: '571.16, 0, 655.04, 611.06', columns: '428.96'}).streamCsv();
  let vi = tabula(this.x, {area: '654.83, 0, 669.04, 611.06', columns: '428.96'}).streamCsv();
  let report = _([i, ii, iii, iv, v, vi]).parallel(6);
  let file = this.x.replace('pdf', 'csv');
  report
  .errors(function (err, push) {
        console.log('Caught error:', err.message);
  }).pipe(fs.createWriteStream('data_csv/' + file));
};

// TypeError: Cannot read property 'forEach' of undefined, perhaps try to read files here
Transform.prototype.iterPdf = function() {
  var filenames = fs.readdirSync('data_pdf');
  filenames.forEach( function (cb) {
    this.readData();
  });
}
