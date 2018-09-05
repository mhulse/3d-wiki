const fs = require('fs-extra');
const glob = require('glob');
const unzip = require('unzip');
const request = require('request');
const toc = require('markdown-toc');

const data = [];

glob.sync('**/*.md', { cwd: `./wiki` }).forEach((file, i) => {

  let title = file.replace('.md', '');

  if (title != 'Home') {

    console.log(title);

    data.push(`## [${title.replace(/-/g, ' ')}](../../wiki/${title.replace(/\s/g, '-')})`);

    data.push('\n');

    data.push(
      toc(fs.readFileSync('./wiki/' + file, 'utf8'), {
        linkify: function(tok, text, slug, options) {
          // update tok.content to how you want it
          tok.content = `[${text}](../../wiki/${title}#${slug})`;
          return tok;
        }
      }).content
    );

    data.push('\n');

  }

});

fs.writeFileSync('README.md', data.join('\n'));
