#!/usr/bin/env node
import { program } from 'commander'
import initCommands from '../src/commands/init.mjs'
import PackCommands from '../src/commands/packs.mjs'
import { version } from '../src/version.mjs'

program
  .version(version)
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