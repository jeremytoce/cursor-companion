#!/usr/bin/env node

import { Command } from 'commander';
import init from '../src/commands/init.mjs';
import PackCommands from '../src/commands/packs.mjs';
import RegistryCommands from '../src/commands/registry.mjs';
import { version } from '../src/version.mjs';

const program = new Command();

program
  .name('cursor-companion')
  .description('CLI tool for managing Cursor AI workflows')
  .version(version);

program
  .command('init')
  .description('Initialize cursor-companion in the current directory')
  .action(init);

program
  .command('packs')
  .description('Manage workflow packs')
  .argument('<action>', 'Action to perform (install/list/available/info)')
  .option('-n, --name <name>', 'Pack name')
  .action(async (action, options) => {
    await PackCommands.handleCommand(action, options, process.cwd());
  });

program
  .command('registry')
  .description('Manage workflow pack registry')
  .argument('<action>', 'Action to perform (get/set)')
  .option('-u, --url <url>', 'Registry URL (required for set)')
  .action(async (action, options) => {
    await RegistryCommands.handleCommand(action, options, process.cwd());
  });

program.parse();
