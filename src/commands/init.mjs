import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import logger from '../utils/logger.mjs';
import PromptUtils from '../utils/promptUtils.mjs';
import fileUtils from '../utils/fileUtils.mjs';
import enquirer from 'enquirer';
const { prompt } = enquirer;

/**
 * Command handler for initialization
 * Handles CLI interactions for project initialization
 */
export default class InitCommand {
  /** File system paths */
  static Paths = {
    base: '.cursor',
    rules: '.cursor/rules',
    prompts: '.cursor/prompts',
  };

  /** Base prompt configuration */
  static BasePrompt = {
    name: 'base',
    retryMessage: 'You can install it later with: cco prompts install -n base',
  };

  constructor(projectRoot) {
    this.projectRoot = projectRoot;
  }

  /**
   * Check if project is already initialized
   * @private
   */
  async isInitialized() {
    return await fileUtils.isInitialized(this.projectRoot);
  }

  /**
   * Prompt for overwrite if already initialized
   * @private
   */
  async promptOverwrite() {
    const { overwrite } = await prompt({
      type: 'confirm',
      name: 'overwrite',
      message: '.cursor directory already exists. Overwrite?',
      initial: false,
    });
    return overwrite;
  }

  /**
   * Create directory structure
   * @private
   */
  async createDirectories() {
    await fs.ensureDir(path.join(this.projectRoot, InitCommand.Paths.rules));
    await fs.ensureDir(path.join(this.projectRoot, InitCommand.Paths.prompts));
  }

  /**
   * Install base prompt
   * @private
   */
  async installBasePrompt() {
    try {
      logger.info('Installing base prompt...');
      await PromptUtils.install(InitCommand.BasePrompt.name, this.projectRoot);
      logger.success('Base prompt installed successfully');
    } catch (error) {
      logger.warning(`Failed to install base prompt. ${InitCommand.BasePrompt.retryMessage}`);
      logger.debug(error.message);
    }
  }

  /**
   * Display available commands help
   * @private
   */
  displayCommands() {
    logger.info('\nAvailable Commands:');

    // Prompt management
    logger.info('\nPrompts:');
    logger.info(`  ${chalk.yellow('cco prompts list')}              List installed prompts`);
    logger.info(
      `  ${chalk.yellow('cco prompts available')}         Show available prompts from registry`,
    );
    logger.info(
      `  ${chalk.yellow('cco prompts install -n <package>[/prompt]')} Install a package or specific prompt`,
    );
    logger.info(`  ${chalk.yellow('cco prompts uninstall -n <name>')} Remove a prompt`);
    logger.info(
      `  ${chalk.yellow('cco prompts info -n <name>')}    Show detailed prompt information`,
    );

    // Rule management
    logger.info('\nRules:');
    logger.info(`  ${chalk.yellow('cco rules list')}              List installed rules`);
    logger.info(
      `  ${chalk.yellow('cco rules available')}         Show available rules from registry`,
    );
    logger.info(`  ${chalk.yellow('cco install rules -n <name>')} Install a rule`);
    logger.info(`  ${chalk.yellow('cco rules uninstall -n <name>')} Remove a rule`);
    logger.info(`  ${chalk.yellow('cco rules info -n <name>')}    Show detailed rule information`);

    // Registry management
    logger.info('\nRegistry:');
    logger.info(`  ${chalk.yellow('cco registry get')}            Show current registry URL`);
    logger.info(`  ${chalk.yellow('cco registry set -u <url>')}   Change registry URL`);

    // General
    logger.info('\nOther Commands:');
    logger.info(
      `  ${chalk.yellow('cco init')}                    Initialize cursor in current directory`,
    );
    logger.info(`  ${chalk.yellow('cco --help')}                  Show this help message`);
    logger.info(`  ${chalk.yellow('cco --version')}               Show version information`);
  }

  /**
   * Display success message and help
   * @private
   */
  displaySuccess() {
    logger.success('\nInitialization complete!');

    // Show directory structure
    logger.info('\nDirectory Structure:');
    logger.info(chalk.blue('.cursor/'));
    logger.info(chalk.blue('├── rules/          # AI rules for code generation'));
    logger.info(chalk.blue('└── prompts/      # Workflow automation prompts'));
    logger.info(chalk.blue('    └── base/       # Base workflow prompt'));

    // Show commands
    this.displayCommands();

    // Show tips
    logger.info('\nTips:');
    logger.info('• Add .cursor/ to your .gitignore file to avoid committing workflow files');
    logger.info('• Use cco packs available to discover new workflow prompts');
    logger.info('• Check prompt documentation with cco packs info -n <name>');
    logger.info('• Visit our GitHub repository for more information and examples');
  }

  /**
   * Initialize project
   */
  async execute() {
    try {
      // Validate project directory
      await fileUtils.validateProjectDir(this.projectRoot);

      // Check if already initialized
      if (await this.isInitialized()) {
        const overwrite = await this.promptOverwrite();
        if (!overwrite) {
          logger.info('Installation cancelled');
          return;
        }
        await fs.remove(path.join(this.projectRoot, InitCommand.Paths.base));
        logger.info('Removed existing .cursor directory');
      }

      // Create directory structure
      await this.createDirectories();

      // Install base prompt
      await this.installBasePrompt();

      // Show success message
      this.displaySuccess();
    } catch (error) {
      logger.error('Failed to initialize .cursor directory');
      logger.error(error.message);
      process.exit(1);
    }
  }

  /**
   * Initialize project
   */
  static async execute(projectRoot = process.cwd()) {
    const command = new InitCommand(projectRoot);
    await command.execute();
  }
}
