const {spawn} = require("child_process");

const main = async () => {
  step("ng serve").then();
  step("node ./cors-side.js").then();
};

/**
 * @param cmd {string} The command you want to run
 * @param [opt] {object} Options
 * @param [opt.withWarn] {boolean} Show warn in stdio
 * @param [opt.env] {NodeJS.ProcessEnv} Environment key-value pairs
 */
const step = (cmd, opt = {withWarn: true}) => {
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

main().then();
