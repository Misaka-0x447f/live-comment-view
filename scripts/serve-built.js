import 'es6-shim';
import 'reflect-metadata';
import path from 'path';
import bodyParser from 'body-parser';
import moment from 'moment';

import express from 'express';
import execa from "execa";

import git from "simple-git";

// check updates
console.log("Checking updates...")
git("./").pull(async (...args) => {
  if (args[1].files.length) {
    console.log("Got some updates. Now building fresh packs...");
    await execa("yarn", [], {stdout: "inherit", stderr: "inherit"});
    await execa("yarn", ["start"], {stdout: "inherit", stderr: "inherit"});
  } else {
    const allowedExt = [
      '.js',
      '.ico',
      '.css',
      '.png',
      '.jpg',
      '.woff2',
      '.woff',
      '.ttf',
      '.svg',
    ];

    const dir = path.resolve("./dist/live-comment-view/");
    const port = 4200;

    class Server {
      app;

      constructor() {
        this.app = express();

        // Redirect all the other requests
        this.app.get('*', (req, res) => {
          if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
            res.sendFile(path.resolve(dir, `./${req.url}`));
          } else {
            res.sendFile(path.resolve(dir, './index.html'));
          }
        });

        // Depending on your own needs, this can be extended
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.raw({limit: '50mb'}));
        this.app.use(bodyParser.text({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({
          limit: '50mb',
          extended: true
        }));

        // Start the server on the provided port
        this.app.listen(port, () => console.log(`** server started at port ${port} **`));

        // Catch errors
        this.app.on('error', (error) => {
          console.error(moment().format(), 'ERROR', error);
        });

        process.on('uncaughtException', (error) => {
          console.log(moment().format(), error);
        });
      }

      static bootstrap() {
        return new Server();
      }
    }

    execa('node', ['--experimental-modules', './cors-side.js'], {stdout: "inherit", stderr: "inherit"});
    Server.bootstrap();
  }
})
