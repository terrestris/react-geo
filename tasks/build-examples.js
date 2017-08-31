var path = require('path');

var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');

var srcDir = path.join(__dirname, '..', 'examples');
var destDir = path.join(__dirname, '..', 'build', 'examples');
var tplDir = path.join(__dirname, '..', 'example-templates');

function augmentExamples(files, metalsmith, done) {
  setImmediate(done); // all remaining code is synchronous
  for (var filename in files) {
    var file = files[filename];
    var match = filename.match(/([^/^.]*)\.md$/);
    if (match) {
      if (!file.layout) {
        throw new Error(filename + ': Missing "layout" in YAML front-matter');
      }
      var id = match[1];

      // add js tag and source
      var jsFilename = id + '.js';
      if (jsFilename in files) {
        var jsSource = files[jsFilename].contents.toString();
        file.js = {
          filename: jsFilename,
          source: jsSource
        };
      }

      // add css tag and source
      var cssFilename = id + '.css';
      if (cssFilename in files) {
        file.css = {
          filename: cssFilename,
          source: files[cssFilename].contents.toString()
        };
      }
    }
  }
}

// var templatesDir = path.join(__dirname, '..', 'config', 'examples');
new Metalsmith('.')
  .source(srcDir)
  .destination(destDir)
  .clean(true)
  .concurrency(25)
  .use(augmentExamples)
  .use(markdown())
  .use(collections({
    'Tutorials': {
      // pattern: ['*.md', '!index.md'],
      sortBy: 'name'
    }
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: tplDir
  }))
  .build(function(err) {
    if (err) {
      process.stderr.write(err + '\n');
    }
  });
