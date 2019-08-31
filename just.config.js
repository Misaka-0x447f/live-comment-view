const {task, parallel} = require("just-scripts");
const {spawn} = require("child_process");

task("start", () => parallel("start/ng", "start/cors"));

task("start/ng", async () => {
  await step("ng serve");
});

task("start/cors", async () => {
  await step("node ./cors-side.js");
});

/**
 * @param cmd {string} The command you want to run
 * @param [opt] {object} Options
 * @param [opt.withWarn] {boolean} Show warn in stdio
 * @param [opt.env] {NodeJS.ProcessEnv} Environment key-value pairs
 */
const step = (cmd, opt = {withWarn: process.env.CI === "true"}) => {
  const child = spawn(cmd, [], {
    shell: true,
    stdio: ["inherit", "inherit", opt.withWarn ? "inherit" : "ignore"],
    env: opt.env,
  });

  return new Promise((resolve, reject) => {
    child.on("error", reject);

    child.on("exit", code => {
      if (code === 0) {
        resolve();
      } else {
        const err = new Error(`child exited with code ${code}`);
        reject(err);
      }
    });
  });
};
