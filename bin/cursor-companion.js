#!/usr/bin/env node

const { program } = require('commander');
const pkg = require('../package.json');
const initCommands = require('../src/commands/init');
const PackCommands = require('../src/commands/packs');

program
  .version(pkg.version)
  .description('Cursor Companion CLI - Template Management Tool');

program
  .command('init')
  .description('Initialize cursor-companion configuration')
  .action(initCommands);

program
  .command('packs <action>')
  .description('Manage workflow packs')
  .option('-n, --name <name>', 'Pack name for install/info commands')
  .action((action, options) => {
    PackCommands.handleCommand(action, options, process.cwd());
  });

program.parse(process.argv); 