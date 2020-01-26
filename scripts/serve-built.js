import "es6-shim";
import "reflect-metadata";
import path from "path";
import bodyParser from "body-parser";

import express from "express";
import execa from "execa";

import git from "simple-git";
import * as fs from "fs";

const getHeadHash = () => {
  return new Promise((resolve, reject) => {
    git("./").revparse(["HEAD"], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const gitPull = () => {
  return new Promise((resolve, reject) => {
    git("./").pull((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.files.length);   // changed files
      }
    });
  });
};

(async () => {
  // check updates
  console.log("Checking updates...");
  await gitPull();
  const currentSourceVersion = await getHeadHash()
  const artifactExists = fs.existsSync(`./dist/${currentSourceVersion}`)
  if (!artifactExists) {
    // has updates
    console.log("Artifact for current HEAD does not exists.");
    console.log("Cleaning outdated artifacts...")
    fs.rmdirSync("./dist/", {
      recursive: true
    })
    console.log("Updating dependencies...");
    await execa("yarn", [], { stdout: "inherit", stderr: "inherit" });
    console.log("Building artifacts...");
    await execa('ng', ['build', `--outputPath=./dist/${currentSourceVersion}`], {stdout: "inherit", stderr: "inherit"});
    console.log("Swapping new process...");
    await execa("yarn", ["start"], { stdout: "inherit", stderr: "inherit" });
    return;
  }
  console.log("Serving artifacts...")
  const allowedExt = [
    ".js",
    ".ico",
    ".css",
    ".png",
    ".jpg",
    ".woff2",
    ".woff",
    ".ttf",
    ".svg",
  ];

  const dir = path.resolve(`./dist/${currentSourceVersion}`);
  const port = 4200;

  class Server {
    app;

    constructor() {
      this.app = express();

      // Redirect all the other requests
      this.app.get("*", (req, res) => {
        if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
          res.sendFile(path.resolve(dir, `./${req.url}`));
        } else {
          res.sendFile(path.resolve(dir, "./index.html"));
        }
      });

      // Depending on your own needs, this can be extended
      this.app.use(bodyParser.json({ limit: "50mb" }));
      this.app.use(bodyParser.raw({ limit: "50mb" }));
      this.app.use(bodyParser.text({ limit: "50mb" }));
      this.app.use(bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
      }));

      // Start the server on the provided port
      this.app.listen(port, () => console.log(`** server started at port ${port} **`));

      // Catch errors
      this.app.on("error", (error) => {
        console.error("ERROR", error);
      });

      process.on("uncaughtException", (error) => {
        console.log(error);
      });
    }

    static bootstrap() {
      return new Server();
    }
  }

  execa("node", ["./cors-side.js"], { stdout: "inherit", stderr: "inherit" });
  Server.bootstrap();
})();
