import fs from 'fs-extra';
import path from 'path';
import logger from '../utils/logger.mjs';
import chalk from 'chalk';
import fileUtils from '../utils/fileUtils.mjs';
import PackUtils from '../utils/packUtils.mjs';

export default class PackCommands {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
  }

  /**
   * Install a workflow pack
   * @param {string} packName - Name of the pack to install
   */
  async install(packName) {
    try {
      await fileUtils.validateProjectDir(this.projectRoot);
      await PackUtils.installPack(packName, this.projectRoot);
      logger.success(`Successfully installed ${packName} workflow pack`);
    } catch (error) {
      logger.error(`Failed to install ${packName}: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * List installed packs
   */
  async list() {
    try {
      await fileUtils.validateProjectDir(this.projectRoot);
      const packs = PackUtils.listInstalledPacks(this.projectRoot);
      logger.info('Installed packs:');

      for (const pack of packs) {
        const metadata = PackUtils.getPackMetadata(pack, this.projectRoot);
        logger.info(`- ${pack} (v${metadata.version})`);
      }
    } catch (error) {
      logger.error(`Failed to list packs: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Show pack info
   * @param {string} packName - Name of the pack to show info for
   */
  async info(packName) {
    try {
      await fileUtils.validateProjectDir(this.projectRoot);
      const metadata = PackUtils.getPackMetadata(packName, this.projectRoot);
      logger.info(`Pack: ${metadata.name}`);
      logger.info(`Author: ${metadata.author}`);
      logger.info(`Version: ${metadata.version}`);
      logger.info(`Description: ${metadata.description}`);
      logger.info('Templates:');
      metadata.templates.forEach((template) => logger.info(`- ${template}`));
    } catch (error) {
      logger.error(`Failed to get pack info: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Handle pack commands
   */
  static async handleCommand(action, options, projectRoot) {
    try {
      const packCommands = new PackCommands(projectRoot);

      switch (action) {
        case 'install':
          if (!options.name) {
            logger.error('Error: Pack name is required');
            process.exit(1);
          }
          await packCommands.install(options.name);
          break;
        case 'list':
          await packCommands.list();
          break;
        case 'available':
          await packCommands.listAvailable();
          break;
        case 'info':
          if (!options.name) {
            logger.error('Error: Pack name is required');
            process.exit(1);
          }
          await packCommands.info(options.name);
          break;
        default:
          logger.error(`Unknown action: ${action}`);
          process.exit(1);
      }
    } catch (error) {
      logger.error(`Pack command failed: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * List available packs from registry
   */
  async listAvailable() {
    try {
      await fileUtils.validateProjectDir(this.projectRoot);
      const installedPacks = PackUtils.listInstalledPacks(this.projectRoot);
      const { workflows } = await PackUtils.listAvailablePacks(this.projectRoot);

      logger.info('Available workflows:');
      for (const pack of workflows) {
        const status = installedPacks.includes(pack.name) ? chalk.green('(installed)') : '';
        logger.info(`- ${chalk.cyan(pack.name)} ${status}`);
        logger.info(`   version: ${pack.version}`);
        logger.info(`   description: ${pack.description}`);
        logger.info(''); // Add blank line between workflows
      }
    } catch (error) {
      logger.error(`Failed to list available workflows: ${error.message}`);
      process.exit(1);
    }
  }
}
