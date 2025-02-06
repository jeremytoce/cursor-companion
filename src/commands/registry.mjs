import fs from 'fs-extra';
import path from 'path';
import logger from '../utils/logger.mjs';
import fileUtils from '../utils/fileUtils.mjs';
import RuleUtils from '../utils/ruleUtils.mjs';

/**
 * Command handler for registry operations
 * Handles CLI interactions for registry management
 */
export default class RegistryCommands {
  /** Command validation messages */
  static Messages = {
    usage: {
      set: 'Usage: cco registry set -u <url>',
      get: 'Usage: cco registry get',
    },
    actions: ['get', 'set'],
    invalidAction: (action) =>
      `Unknown action: ${action}. Valid actions are: ${RegistryCommands.Messages.actions.join(', ')}`,
  };

  /** File system paths */
  static Paths = {
    config: '.cursor/config.json',
  };

  constructor(projectRoot) {
    this.projectRoot = projectRoot;
  }

  /**
   * Validate project directory before operations
   * @private
   */
  async validateProject() {
    await fileUtils.validateProjectDir(this.projectRoot);
  }

  /**
   * Get current registry URL
   */
  async get() {
    try {
      await this.validateProject();
      const configPath = path.join(this.projectRoot, RegistryCommands.Paths.config);

      if (!(await fs.pathExists(configPath))) {
        logger.info('No custom registry set (using default)');
        return;
      }

      const config = await fs.readJson(configPath);
      if (config.registry) {
        logger.info(`Current registry: ${config.registry}`);
      } else {
        logger.info('No custom registry set (using default)');
      }
    } catch (error) {
      logger.error(`Failed to get registry: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Set registry URL
   */
  async set(url) {
    try {
      await this.validateProject();
      const configPath = path.join(this.projectRoot, RegistryCommands.Paths.config);

      // Ensure config directory exists
      await fs.ensureDir(path.dirname(configPath));

      // Load or create config
      let config = {};
      if (await fs.pathExists(configPath)) {
        config = await fs.readJson(configPath);
      }

      // Update registry URL
      config.registry = url;
      await fs.writeJson(configPath, config, { spaces: 2 });
      logger.success(`Registry URL set to: ${url}`);
    } catch (error) {
      logger.error(`Failed to set registry: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Handle registry commands
   */
  static async handleCommand(action, options, projectRoot) {
    try {
      // Validate action
      if (!this.Messages.actions.includes(action)) {
        logger.error(this.Messages.invalidAction(action));
        process.exit(1);
      }

      const registryCommands = new RegistryCommands(projectRoot);

      // Validate URL for set action
      if (action === 'set' && !options.url) {
        logger.error(this.Messages.usage.set);
        process.exit(1);
      }

      // Execute command
      switch (action) {
        case 'get':
          await registryCommands.get();
          break;
        case 'set':
          await registryCommands.set(options.url);
          break;
      }
    } catch (error) {
      logger.error(`Registry command failed: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Get available packs from registry
   * @param {string} projectRoot - Project root directory
   * @returns {Promise<Object>} Available packs from registry
   */
  static async getAvailablePrompts(projectRoot) {
    const config = await this.loadConfig(projectRoot);
    return PromptUtils.listAvailablePrompts(projectRoot, config.registry);
  }

  /**
   * Get available rules from registry
   * @param {string} projectRoot - Project root directory
   * @returns {Promise<Object>} Available rules from registry
   */
  static async getAvailableRules(projectRoot) {
    const config = await this.loadConfig(projectRoot);
    return RuleUtils.listAvailableRules(projectRoot, config.registry);
  }

  /**
   * Fetch rule data from registry
   * @param {string} ruleName - Name of the rule to fetch
   * @param {string} projectRoot - Project root directory
   * @returns {Promise<Object>} Rule data
   */
  static async fetchRule(ruleName, projectRoot) {
    const config = await this.loadConfig(projectRoot);
    const registryUrl = config.registry || this.DEFAULT_REGISTRY;

    try {
      const url = `${registryUrl}/${ruleName}/pack.json`;
      logger.info('Fetching rule:');
      logger.info(`- Rule name: ${ruleName}`);
      logger.info(`- Full URL: ${url}`);

      const response = await fetch(url);
      logger.info('Response received:');
      logger.info(`- Status: ${response.status}`);
      logger.info(`- Status Text: ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`Registry request failed (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      logger.info('Rule data received:');
      logger.info(JSON.stringify(data, null, 2));

      return data;
    } catch (error) {
      logger.error('Error details:');
      logger.error(`- Error name: ${error.name}`);
      logger.error(`- Error message: ${error.message}`);
      logger.error(`- Stack trace: ${error.stack}`);
      throw new Error(`Failed to fetch rule ${ruleName} from registry: ${error.message}`);
    }
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
