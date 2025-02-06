import logger from '../utils/logger.mjs';
import fileUtils from '../utils/fileUtils.mjs';
import chalk from 'chalk';
import { ValidationError, ComponentError } from '../utils/errors.mjs';

/**
 * Base command handler for component operations
 */
export default class BaseCommand {
  /** Command validation messages */
  static Messages = {
    usage: {
      install: 'Usage: cco TYPE install -n <name>',
      uninstall: 'Usage: cco TYPE uninstall -n <name>',
      info: 'Usage: cco TYPE info -n <name>',
    },
    actions: ['install', 'uninstall', 'list', 'available', 'info'],
  };

  constructor(projectRoot, type, utils, messages = {}) {
    this.projectRoot = projectRoot;
    this.type = type;
    this.utils = utils;
    this.messages = messages;
  }

  /**
   * Validate project directory before operations
   * @private
   */
  async validateProject() {
    await fileUtils.validateProjectDir(this.projectRoot);
  }

  /**
   * Validate command requirements
   * @private
   */
  validateCommand(action, name) {
    if (!this.constructor.Messages.actions.includes(action)) {
      throw new ValidationError(
        `Unknown action: ${action}. Valid actions are: ${this.constructor.Messages.actions.join(', ')}`,
      );
    }

    if (['install', 'uninstall', 'info'].includes(action) && !name) {
      throw new ValidationError(this.constructor.Messages.usage[action].replace('TYPE', this.type));
    }
  }

  /**
   * Execute command with error handling
   * @private
   */
  async executeCommand(action, name, fn) {
    try {
      await this.validateProject();
      return await fn();
    } catch (error) {
      if (error instanceof ValidationError) {
        logger.error(error.message);
      } else if (error instanceof ComponentError) {
        logger.error(
          this.messages[`${action}Error`]?.(name, error) ||
            `Failed to ${action} ${this.type}: ${error.message}`,
        );
      } else {
        logger.error(`Unexpected error: ${error.message}`);
        logger.debug(error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * Install a component
   */
  async install(name) {
    await this.executeCommand('install', name, async () => {
      await this.utils.install(name, this.projectRoot);
      logger.success(this.messages.installSuccess?.(name) || `Successfully installed ${name}`);
    });
  }

  /**
   * Uninstall a component
   */
  async uninstall(name) {
    await this.executeCommand('uninstall', name, async () => {
      await this.utils.uninstall(name, this.projectRoot);
      logger.success(this.messages.uninstallSuccess?.(name) || `Successfully uninstalled ${name}`);
    });
  }

  /**
   * List installed components
   */
  async list() {
    await this.executeCommand('list', null, async () => {
      const items = await this.utils.listInstalled(this.projectRoot);

      logger.info(this.messages.listHeader || `Installed ${this.type}s:`);
      for (const item of items) {
        const metadata = await this.utils.getMetadata(item, this.projectRoot);
        logger.info(this.messages.listItem?.(item, metadata) || `- ${item} (v${metadata.version})`);
      }
    });
  }

  /**
   * List available components from registry
   */
  async listAvailable() {
    await this.executeCommand('available', null, async () => {
      const { [this.type + 's']: items } = await this.utils.listAvailable(this.projectRoot);

      logger.info(this.messages.availableHeader || `Available ${this.type}s:`);
      for (const item of items) {
        const installed = await this.utils.listInstalled(this.projectRoot);
        const status = installed.includes(item.name) ? chalk.green('(installed)') : '';

        logger.info(
          this.messages.availableItem?.(item, status) || `- ${chalk.cyan(item.name)} ${status}`,
        );
        logger.info(`   version: ${item.version}`);
        logger.info(`   author: ${item.author}`);
        logger.info(`   description: ${item.description}`);
        if (item.tags?.length) {
          logger.info(`   tags: ${item.tags.join(', ')}`);
        }
        if (item.promptCount) {
          logger.info(`   prompts: ${item.promptCount}`);
        }
        logger.info('');
      }
    });
  }

  /**
   * Show component info
   */
  async info(name, verbose = false) {
    await this.executeCommand('info', name, async () => {
      const metadata = await this.utils.getMetadata(name, this.projectRoot);
      await this.displayInfo(metadata, verbose);
    });
  }

  /**
   * Display component info (to be overridden by subclasses)
   * @protected
   */
  displayInfo(metadata, verbose) {
    logger.info(`${this.type}: ${metadata.name}`);
    logger.info(`Version: ${metadata.version}`);
    logger.info(`Description: ${metadata.description}`);
  }

  /**
   * Handle component commands
   */
  static async handleCommand(action, options, projectRoot) {
    const command = new this(projectRoot);
    command.validateCommand(action, options.name);

    switch (action) {
      case 'install':
        await command.install(options.name);
        break;
      case 'uninstall':
        await command.uninstall(options.name);
        break;
      case 'list':
        await command.list();
        break;
      case 'available':
        await command.listAvailable();
        break;
      case 'info':
        await command.info(options.name, options.verbose);
        break;
    }
  }
}
