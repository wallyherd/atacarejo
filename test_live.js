const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("jsdomError", (e) => console.error(e));
virtualConsole.on("error", (e) => console.error(e));
virtualConsole.on("log", (...e) => console.log(...e));
const dom = new JSDOM(html, { runScripts: 'dangerously', virtualConsole });
const script = fs.readFileSync('js/data.js', 'utf8') + '\n' + fs.readFileSync('js/app.js', 'utf8');
try { 
  dom.window.eval(script); 
  console.log('Script ran successfully.'); 
} catch(e) { 
  console.error('EVAL ERROR:', e); 
}
setTimeout(() => process.exit(0), 1000);
