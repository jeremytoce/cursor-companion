#!/usr/bin/env node

const { program } = require('commander');
const init = require('../src/commands/init');
const logger = require('../src/utils/logger');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .description('Cursor Companion CLI - Template Management Tool');

program
  .command('init')
  .description('Initialize cursor-companion templates in your project')
  .action(async () => {
    try {
      await init();
    } catch (error) {
      logger.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv); 