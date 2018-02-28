const path = require('path');

const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const collections = require('metalsmith-collections');

const srcDir = path.join(__dirname, '..', 'src');
const destDir = path.join(__dirname, '..', 'build', 'examples');
const tplDir = path.join(__dirname, '..', 'example-templates');

const vendorsFileName = 'vendors.js';
const commonsFileName = 'commons.js';

/**
 * Fixes the import string in the example source to use '@terrestris/react-geo'
 * instead of the path.
 *
 * @param {String} jsSource The source of the example.
 * @return {String} The fixed path.
 */
function fixImports(jsSource) {
  const re = /from '(\.\.\/|\.\/)*index\.js'/g;
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
  for (let filename in files) {
    const file = files[filename];
    const match = filename.match(/([^/^.]*)\.example\.md$/);

    if (match) {
      if (!file.layout) {
        throw new Error(`${filename}: Missing "layout" in YAML front-matter`);
      }
      const id = match[1];
      const jsFilename = `${id}.example.jsx`;
      const key = getKeyOfFile(files, jsFilename);

      if (key in files) {
        const jsSource = fixImports(files[key].contents.toString());
        const relativeCommonsFilePath = key.match(/(\/)/g).map(() => '../').join('');

        file.js = {
          filename: jsFilename,
          vendors: `${relativeCommonsFilePath}${vendorsFileName}`,
          commons: `${relativeCommonsFilePath}${commonsFileName}`,
          transpiled: `${id}.js`,
          source: jsSource
        };
      }

      // Add css tag and source.
      const cssFilename = `${id}.example.css`;
      if (cssFilename in files) {
        file.css = {
          filename: cssFilename,
          source: files[cssFilename].contents.toString()
        };
      }
    }
  }
}

/**
 * Filter files we don't want to be copied.
 *
 * @param {Object} files The files.
 */
function filter(files) {
  for (let filename in files) {
    if (filename.indexOf('.spec.') !== -1) {
      delete files[filename];
    }
  }
}

new Metalsmith('.')
  .use(filter)
  .source(srcDir)
  .destination(destDir)
  .clean(true)
  .concurrency(25)
  .use(augmentExamples)
  .use(markdown())
  .use(collections({
    'Examples': {
      // pattern: ['*.md', '!index.md'],
      sortBy: 'title'
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
