import execa from "execa";

execa('yarn', ['run', 'build'], {stdout: "inherit", stderr: "inherit"});
