#!/usr/local/bin node
var fs = require('fs');
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();
var header = fs.readFileSync('src/includes/header.html');
var footer = fs.readFileSync('src/includes/footer.html');

fs.readdir('src/', function (err, files) {
  if (err) {
    throw 'Oh no Fails ahead!';
  }

  files.forEach(function (file) {
    if (file !== 'includes') {
      resolveFailDir('src/', file);
    }
  });
});

function resolveFailDir(dir, file) {
  var dir = dir + file;
  var index = fs.readFileSync(dir + '/index.md');
  var result = md.render(index.toString());
  fs.writeFile(file + '.html', header + result + '\n' + getFails(dir) + footer);
}

function getFails(dir) {
  try {
    var fails = fs.readFileSync(dir + '/fail-list.json');
    var failData = JSON.parse(fails);
    return buildTable(failData);
  } catch (e) {
    return '';
  }
}

function buildTable(failData) {
  var table = ['<table class="table table-striped">', '<tbody>'];

  failData.fails.forEach(function (failer) {
    row = '<tr><td><a href="' + failer.issue + '">' + failer.name + '</a></td><td>' + failer.raised + '</td></tr>';
    table.push(row);
  });

  table.push('</tbody>', '</table>');

  return table.join('\n');
}
