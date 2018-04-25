const fs = require('fs');
const spawn = require('child_process').spawn;

const rfb = require('rfb2');

module.exports = {
  async connect({ host = '127.0.0.1', port = 5901, password = 'password', outputFileName = 'output' } = {}) {
    console.log('Connecting ...');

    return new Promise((resolve, reject) => {
      const connection = rfb.createConnection({
        host, port, password,
      });

      connection.on('connect', () => {
        console.log('Connected');

        const ppmHeader = Buffer(['P6', connection.width + ' ' + connection.height, '255\n'].join('\n'));
        const screen = new Buffer(connection.width * connection.height * 3);

        if (fs.existsSync(`${outputFileName}.avi`)) {
          fs.unlink(`${outputFileName}.avi`);
        };

        const out = spawn('/usr/local/bin/ffmpeg', `-f image2pipe -pix_fmt yuv420p -i - ${outputFileName}.avi`.split(' '));

        out.stdout.pipe(process.stdout);
        out.stderr.pipe(process.stderr);

        const interval = setInterval(() => {
          out.stdin.write(ppmHeader);
          out.stdin.write(screen);
        }, 50);

        connection.on('rect', rect => {
          for (let y = rect.y; y < rect.y + rect.height; ++y) {
            for (let x = rect.x; x < rect.x + rect.width; ++x) {
              const idx = (connection.width * y + x) * 3
              const bdx = (rect.width * (y - rect.y) + (x - rect.x)) << 2;
              screen[idx + 2] = rect.buffer[bdx];
              screen[idx + 1] = rect.buffer[bdx + 1];
              screen[idx + 0] = rect.buffer[bdx + 2];
            }
          }
        });

        const stop = () => {
          clearInterval(interval);
          out.stdin.end();
          connection.stream.end();
        };

        resolve({
          stop,
        });
      });
    });
  }
};
