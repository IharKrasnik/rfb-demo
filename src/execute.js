const program = require('commander');

const rfb = require('./rfb');

program
  .version('0.0.1')
  .option('-p, --port [type]', 'RFB port')
  .option('-h, --host [type]', 'RFB host')
  .option('-w, --password [type]', 'password')
  .option('-o, --output [type]', 'output file name')
  .parse(process.argv);

const main = async () => {
  const connection = await rfb.connect({
    host: program.host,
    port: program.port,
    password: program.password,
    outputFileName: program.output,
  });

  process.on('SIGINT', () => connection.stop());
};

main();
