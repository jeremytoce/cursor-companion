import BaseUtils from './baseUtils.mjs';

/**
 * Utility class for managing prompts
 * Extends BaseUtils to handle prompt-specific operations
 */
export default class PromptUtils extends BaseUtils {
  /** Type identifier for prompts */
  static TYPE = 'prompt';

  /** Subdirectory name for prompts */
  static SUB_DIR = 'prompts';

  /**
   * Install a prompt
   * @param {string} promptName - Name of the prompt to install
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<boolean>} True if installation successful
   * @throws {Error} If installation fails
   */
  static async install(promptName, projectRoot = process.cwd()) {
    return super.install(promptName, projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * Uninstall a prompt
   * @param {string} promptName - Name of the prompt to uninstall
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<boolean>} True if uninstallation successful
   * @throws {Error} If uninstallation fails
   */
  static async uninstall(promptName, projectRoot = process.cwd()) {
    return super.uninstall(promptName, projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * List installed prompts
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<string[]>} Array of installed prompt names
   */
  static async listInstalled(projectRoot = process.cwd()) {
    return super.listInstalled(projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * List available prompts from registry
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<Object>} Object containing array of available prompts with metadata
   */
  static async listAvailable(projectRoot = process.cwd()) {
    return super.listAvailable(projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * Get metadata for a specific prompt
   * @param {string} promptName - Name of the prompt
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<Object>} Prompt metadata
   * @throws {Error} If prompt not found or invalid
   */
  static async getMetadata(promptName, projectRoot = process.cwd()) {
    return super.getMetadata(promptName, projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }
}
