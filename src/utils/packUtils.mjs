import BaseUtils from './baseUtils.mjs';

/**
 * Utility class for managing workflow packs
 * Extends BaseUtils to handle pack-specific operations
 */
export default class PackUtils extends BaseUtils {
  /** Type identifier for workflows */
  static TYPE = 'workflow';

  /** Subdirectory name for workflows */
  static SUB_DIR = 'workflows';

  /**
   * Install a workflow pack
   * @param {string} packName - Name of the pack to install
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<boolean>} True if installation successful
   * @throws {Error} If installation fails
   */
  static async install(packName, projectRoot = process.cwd()) {
    return super.install(packName, projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * Uninstall a workflow pack
   * @param {string} packName - Name of the pack to uninstall
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<boolean>} True if uninstallation successful
   * @throws {Error} If uninstallation fails
   */
  static async uninstall(packName, projectRoot = process.cwd()) {
    return super.uninstall(packName, projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * List installed workflow packs
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<string[]>} Array of installed pack names
   */
  static async listInstalled(projectRoot = process.cwd()) {
    return super.listInstalled(projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * List available workflow packs from registry
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<Object>} Object containing array of available packs with metadata
   */
  static async listAvailable(projectRoot = process.cwd()) {
    return super.listAvailable(projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }

  /**
   * Get metadata for a specific workflow pack
   * @param {string} packName - Name of the pack
   * @param {string} [projectRoot] - Project root directory (defaults to current directory)
   * @returns {Promise<Object>} Pack metadata
   * @throws {Error} If pack not found or invalid
   */
  static async getMetadata(packName, projectRoot = process.cwd()) {
    return super.getMetadata(packName, projectRoot, this.getOptions(this.TYPE, this.SUB_DIR));
  }
}
