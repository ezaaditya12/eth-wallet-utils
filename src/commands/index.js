import program from 'commander';
import { collectCmd } from './collect';

collectCmd(program);

export const start = program => {
  program.version('0.0.1').description('Collect Money');
  program.parse(process.argv);
};

start(program);
