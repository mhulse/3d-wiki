const fs = require('fs-extra');
const glob = require('glob');
const unzip = require('unzip');
const request = require('request');
const toc = require('markdown-toc');

const data = [];
const top = '[<img width="32" height="32" align="right" src="https://assets-cdn.github.com/images/icons/emoji/unicode/261d.png" class="emoji" title="TOC">](#readme)';

//------------------------------------------------------------------------------
// YouTube cruft …
// @TODO Clean up code; make modular and get rid of `next()` jenk!

const ypi = require('youtube-channel-videos');
const credentials = require('./credentials.json');
const _ = require('underscore');

data.push(`## My Blender YouTube channel: [TL;DR – 3D](https://www.youtube.com/channel/UCFoE0SgDe0t82Ra2UAit57Q)${top}`)
data.push('\n');

ypi.channelVideos(credentials.api_key, 'UCFoE0SgDe0t82Ra2UAit57Q', function(videos) {
  _(videos).each(video => {
    data.push(`- [${video.snippet.title}](https://www.youtube.com/watch?v=${video.id.videoId})`)
  });
  data.push('\n');
  // Stupid, but I don’t have much time to make this better:
  next();
});

//------------------------------------------------------------------------------

function next() {

  glob.sync('**/*.md', { cwd: `./wiki` }).forEach((file, i) => {

    let title = file.replace('.md', '');

    if (title != 'Home') {

      console.log(title);

      data.push(`## [${title.replace(/-/g, ' ')}](../../wiki/${title.replace(/\s/g, '-')})&nbsp;${top}`);

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

}
