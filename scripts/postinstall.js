import execa from "execa";

execa('yarn', ['run', 'build']).stdout.pipe(process.stdout);
