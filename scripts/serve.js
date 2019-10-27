import execa from "execa";

(async () => {
  execa("node", ["--experimental-modules", "./cors-side.js"], {stdout: "inherit", stderr: "inherit"});
  await execa("ng", ["serve"], {stdout: "inherit", stderr: "inherit"});
})();
