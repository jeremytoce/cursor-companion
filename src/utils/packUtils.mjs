import fs from 'fs-extra';
import path from 'path';
import logger from './logger.mjs';

export default class PackUtils {
  static PACKAGE_ROOT = new URL('../../', import.meta.url).pathname;
  static PACKS_DIR = 'cursor-companion/workflow-packs';

  /**
   * Get source pack directory
   * @private
   */
  static getSourcePath(packName) {
    return path.join(this.PACKAGE_ROOT, 'workflow-packs', packName);
  }

  /**
   * Get metadata for a specific pack
   */
  static getPackMetadata(packName, projectRoot) {
    const packPath = path.join(projectRoot, this.PACKS_DIR, packName, 'pack.json');
    if (!fs.existsSync(packPath)) {
      throw new Error(`Pack ${packName} not found`);
    }
    return JSON.parse(fs.readFileSync(packPath, 'utf8'));
  }

  /**
   * List all installed packs
   */
  static listInstalledPacks(projectRoot) {
    const packsDir = path.join(projectRoot, this.PACKS_DIR);
    if (!fs.existsSync(packsDir)) {
      return [];
    }
    return fs.readdirSync(packsDir)
      .filter(item => {
        const packPath = path.join(packsDir, item);
        return fs.statSync(packPath).isDirectory() && 
               fs.existsSync(path.join(packPath, 'pack.json'));
      });
  }

  /**
   * Install a single pack
   */
  static async installPack(packName, projectRoot = process.cwd()) {
    const sourcePath = this.getSourcePath(packName);
    const destPath = path.join(projectRoot, this.PACKS_DIR, packName);
    
    // Validate source pack exists
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Pack ${packName} not found in ${sourcePath}`);
    }

    // Validate pack.json exists
    const packJsonPath = path.join(sourcePath, 'pack.json');
    if (!fs.existsSync(packJsonPath)) {
      throw new Error(`Invalid pack: missing pack.json in ${packName}`);
    }

    try {
      // Read metadata from source pack
      const sourceMetadata = JSON.parse(
        fs.readFileSync(packJsonPath, 'utf8')
      );
      logger.info(`Installing ${packName} v${sourceMetadata.version}...`);

      // Create destination directory if it doesn't exist
      await fs.ensureDir(path.dirname(destPath));
      
      // Copy pack files
      await fs.copy(sourcePath, destPath);

      logger.success(`✓ Installed ${packName}`);
    } catch (error) {
      throw new Error(`Failed to install pack: ${error.message}`);
    }
  }

  /**
   * Install multiple packs
   */
  static async installPacks(packNames, projectRoot = process.cwd()) {
    const results = [];
    for (const pack of packNames) {
      try {
        await this.installPack(pack, projectRoot);
        results.push({ pack, success: true });
      } catch (error) {
        logger.error(`Failed to install ${pack}: ${error.message}`);
        results.push({ pack, success: false, error });
      }
    }
    return results;
  }
}
