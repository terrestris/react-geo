var path = require('path');

var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');

var srcDir = path.join(__dirname, '..', 'src');
var destDir = path.join(__dirname, '..', 'build', 'examples');
var tplDir = path.join(__dirname, '..', 'example-templates');

/**
 * Fixes the import string in the example source to use '@terrestris/react-geo'
 * instead of the path.
 *
 * @param {String} jsSource The source of the example.
 * @return {String} The fixed path.
 */
function fixImports(jsSource) {
  var re = /from '(\.\.\/|\.\/)*index\.js'/g;
  return jsSource.replace(re, 'from \'@terrestris/react-geo\'');
}

/**
 * Determine the matching key in the files object.
 *
 * @param {Object} files The object containing the files information.
 * @param {String} jsFilename The filename.
 * @return {String} The macthing key for the filename.
 */
function getKeyOfFile(files, jsFilename) {
  return Object.keys(files).find((path) => path.endsWith(jsFilename));
}

/**
 * Augment the examples to fit our needs.
 *
 * @param {Object} files The files.
 */
function augmentExamples(files) {
  for (var filename in files) {
    var file = files[filename];

    var match = filename.match(/([^/^.]*)\.example\.md$/);
    if (match) {
      if (!file.layout) {
        throw new Error(filename + ': Missing "layout" in YAML front-matter');
      }
      var id = match[1];

      // add js tag and source
      var jsFilename = id + '.example.jsx';

      var key = getKeyOfFile(files, jsFilename);

      if (key in files) {
        var jsSource = files[key].contents.toString();
        jsSource = fixImports(jsSource);

        file.js = {
          filename: jsFilename,
          transpiled: id + '.js',
          source: jsSource
        };
      }

      // add css tag and source
      var cssFilename = id + '.example.css';
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
    'Examples': {
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
