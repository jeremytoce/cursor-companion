import fs from 'fs-extra';
import path from 'path';
import logger from '../utils/logger.mjs';
import fileUtils from '../utils/fileUtils.mjs';

export default class RegistryCommands {
  static CONFIG_FILE = '.cursor/config.json';

  /**
   * Handle registry commands
   * @param {string} action - Action to perform (get/set)
   * @param {object} options - Command options
   * @param {string} projectRoot - Project root directory
   */
  static async handleCommand(action, options, projectRoot) {
    try {
      switch (action) {
        case 'get':
          await this.getRegistry(projectRoot);
          break;
        case 'set':
          if (!options.url) {
            logger.error('Error: Registry URL is required');
            process.exit(1);
          }
          await this.setRegistry(options.url, projectRoot);
          break;
        default:
          logger.error(`Unknown action: ${action}`);
          process.exit(1);
      }
    } catch (error) {
      logger.error(`Failed to ${action} registry: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Get current registry URL
   * @param {string} projectRoot - Project root directory
   */
  static async getRegistry(projectRoot) {
    const config = await this.loadConfig(projectRoot);
    logger.info(`Current registry: ${config.registry || 'default'}`);
  }

  /**
   * Set registry URL
   * @param {string} url - New registry URL
   * @param {string} projectRoot - Project root directory
   */
  static async setRegistry(url, projectRoot) {
    await fileUtils.validateProjectDir(projectRoot);
    const config = await this.loadConfig(projectRoot);
    config.registry = url;
    await this.saveConfig(config, projectRoot);
    logger.success(`Registry updated to: ${url}`);
  }

  static async loadConfig(projectRoot) {
    const configPath = path.join(projectRoot, this.CONFIG_FILE);
    try {
      return await fs.readJson(configPath);
    } catch (error) {
      return {};
    }
  }

  static async saveConfig(config, projectRoot) {
    const configPath = path.join(projectRoot, this.CONFIG_FILE);
    await fs.ensureDir(path.dirname(configPath));
    await fs.writeJson(configPath, config, { spaces: 2 });
  }
}
