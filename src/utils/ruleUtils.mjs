import BaseUtils from './baseUtils.mjs';

/**
 * Utility class for managing rules
 * Extends BaseUtils to handle rule-specific operations
 */
export default class RuleUtils extends BaseUtils {
  /** Type identifier for rules */
  static TYPE = 'rule';

  /** Subdirectory name for rules */
  static SUB_DIR = 'rules';

  /**
   * Install a rule
   * @param {string} ruleName - Name of the rule to install
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<boolean>} True if installation successful
   * @throws {Error} If installation fails
   */
  static async install(ruleName, projectRoot = process.cwd()) {
    return super.install(ruleName, projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * Uninstall a rule
   * @param {string} ruleName - Name of the rule to uninstall
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<boolean>} True if uninstallation successful
   * @throws {Error} If uninstallation fails
   */
  static async uninstall(ruleName, projectRoot = process.cwd()) {
    return super.uninstall(ruleName, projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * List installed rules
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<string[]>} Array of installed rule names
   */
  static async listInstalled(projectRoot = process.cwd()) {
    return super.listInstalled(projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * List available rules from registry
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<Object>} Object containing array of available rules with metadata
   */
  static async listAvailable(projectRoot = process.cwd()) {
    return super.listAvailable(projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * Get metadata for a specific rule
   * @param {string} ruleName - Name of the rule
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<Object>} Rule metadata
   * @throws {Error} If rule not found or invalid
   */
  static async getMetadata(ruleName, projectRoot = process.cwd()) {
    return super.getMetadata(ruleName, projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }
}
