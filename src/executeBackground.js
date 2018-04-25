const spawn = require('child_process').spawn;

const program = require('commander');

program
  .version('0.0.1')
  .option('-o, --output [type]', 'output file name (background)')
  .parse(process.argv);

const backgroundProcess = spawn('node', [`${__dirname}/execute.js`, '-o', program.output ||'output_background'], {
  stdio: 'ignore',
  detached: true
});

console.log('background process pid', backgroundProcess.pid);

backgroundProcess.unref();
