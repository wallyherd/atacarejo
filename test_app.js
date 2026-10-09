const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously' });
const script = fs.readFileSync('js/data.js', 'utf8') + '\n' + fs.readFileSync('js/app.js', 'utf8');
try {
  dom.window.eval(script);
  console.log('DOM script evaluated successfully without errors!');
} catch (e) {
  console.error('ERROR IN SCRIPT:', e);
}
