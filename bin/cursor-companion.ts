#!/usr/bin/env node
import { program } from 'commander';
import initCommands from '@/commands/init';
import PackCommands from '@/commands/packs';

const VERSION = '0.1.8';

program.version(VERSION).description('Cursor Companion CLI - Template Management Tool');

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
