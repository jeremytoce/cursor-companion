#!/usr/bin/env node --no-deprecation

import { Command } from 'commander';
import InitCommand from '../src/commands/init.mjs';
import PromptCommands from '../src/commands/prompts.mjs';
import RuleCommands from '../src/commands/rules.mjs';
import RegistryCommands from '../src/commands/registry.mjs';
import { version } from '../src/version.mjs';

const program = new Command();

program.name('cco').description('CLI tool for managing Cursor AI prompts').version(version);

program
  .command('init')
  .description('Initialize cco in the current directory')
  .action(() => InitCommand.execute(process.cwd()));

program
  .command('install')
  .description('Install packages (prompts/rules)')
  .argument('<type>', 'Type of installation (prompts/rules)')
  .option('-n, --name <name>', 'Package or prompt name (format: package/prompt)')
  .action(async (type, options) => {
    switch (type) {
      case 'prompts':
        await PromptCommands.handleCommand('install', options, process.cwd());
        break;
      case 'rules':
        await RuleCommands.handleCommand('install', options, process.cwd());
        break;
      default:
        console.error(`Unknown installation type: ${type}`);
        process.exit(1);
    }
  });

program
  .command('prompts')
  .description('Manage prompts')
  .argument('<action>', 'Action to perform (install/uninstall/list/available/info)')
  .option('-n, --name <name>', 'Package or prompt name (format: package/prompt)')
  .option('-v, --verbose', 'Show detailed information')
  .action(async (action, options) => {
    await PromptCommands.handleCommand(action, options, process.cwd());
  });

program
  .command('rules')
  .description('Manage rules')
  .argument('<action>', 'Action to perform (install/uninstall/list/available/info)')
  .option('-n, --name <name>', 'Rule name')
  .action(async (action, options) => {
    await RuleCommands.handleCommand(action, options, process.cwd());
  });

program
  .command('registry')
  .description('Manage prompt registry')
  .argument('<action>', 'Action to perform (get/set)')
  .option('-u, --url <url>', 'Registry URL (required for set)')
  .action(async (action, options) => {
    await RegistryCommands.handleCommand(action, options, process.cwd());
  });

program.parse();
