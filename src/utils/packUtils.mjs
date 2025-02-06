import fs from 'fs-extra';
import path from 'path';
import logger from './logger.mjs';

export default class PackUtils {
  static PACKS_DIR = '.cursor/workflows';
  static DEFAULT_REGISTRY =
    'https://raw.githubusercontent.com/jeremytoce/cursor-companion-library/main';
  static GITHUB_API = 'https://api.github.com/repos/jeremytoce/cursor-companion-library/contents';

  /**
   * Get source pack URL
   * @private
   */
  static async getSourcePath(packName) {
    try {
      const config = await this.loadConfig(process.cwd());
      const registry = config.registry || this.DEFAULT_REGISTRY;
      return packName ? `${registry}/workflows/${packName}` : registry;
    } catch (error) {
      return packName ? `${this.DEFAULT_REGISTRY}/workflows/${packName}` : this.DEFAULT_REGISTRY;
    }
  }

  /**
   * Load config file
   * @private
   */
  static async loadConfig(projectRoot) {
    const configPath = path.join(projectRoot, '.cursor/config.json');
    try {
      return await fs.readJson(configPath);
    } catch (error) {
      return {};
    }
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
    return fs.readdirSync(packsDir).filter((item) => {
      const packPath = path.join(packsDir, item);
      return fs.statSync(packPath).isDirectory() && fs.existsSync(path.join(packPath, 'pack.json'));
    });
  }

  /**
   * Install a single pack
   */
  static async installPack(packName, projectRoot = process.cwd()) {
    const sourceUrl = await this.getSourcePath(packName);
    const destPath = path.join(projectRoot, this.PACKS_DIR, packName);

    try {
      // Fetch and validate pack.json first
      const packJsonUrl = `${sourceUrl}/pack.json`;
      const response = await fetch(packJsonUrl);

      if (!response.ok) {
        throw new Error(`Pack ${packName} not found in registry`);
      }

      const metadata = await response.json();
      logger.info(`Installing ${packName} v${metadata.version}...`);

      // Create destination directory
      await fs.ensureDir(destPath);

      // Download and write pack.json
      await fs.writeFile(path.join(destPath, 'pack.json'), JSON.stringify(metadata, null, 2));

      // Download each template file
      if (metadata.templates && Array.isArray(metadata.templates)) {
        for (const template of metadata.templates) {
          const templateUrl = `${sourceUrl}/${template}`;
          const templateResponse = await fetch(templateUrl);

          if (!templateResponse.ok) {
            throw new Error(`Failed to download template ${template}`);
          }

          const content = await templateResponse.text();
          await fs.writeFile(path.join(destPath, template), content);
        }
      }

      // Download README if exists
      try {
        const readmeResponse = await fetch(`${sourceUrl}/README.md`);
        if (readmeResponse.ok) {
          const readme = await readmeResponse.text();
          await fs.writeFile(path.join(destPath, 'README.md'), readme);
        }
      } catch (error) {
        // Ignore README download failures
        logger.debug(`No README found for ${packName}`);
      }

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

  /**
   * List all available packs from registry
   * @param {string} projectRoot - Project root directory
   * @returns {Promise<Array>} List of available packs with metadata
   */
  static async listAvailablePacks(projectRoot = process.cwd()) {
    try {
      const registry = await this.getSourcePath('');

      // Get workflows directory contents from GitHub API
      const apiResponse = await fetch(`${this.GITHUB_API}/workflows`);
      if (!apiResponse.ok) {
        throw new Error('Failed to fetch workflows directory');
      }

      const contents = await apiResponse.json();
      const workflowNames = contents.filter((item) => item.type === 'dir').map((item) => item.name);

      const workflows = [];

      for (const name of workflowNames) {
        try {
          const packJsonUrl = `${registry}/workflows/${name}/pack.json`;
          const response = await fetch(packJsonUrl);
          if (response.ok) {
            const metadata = await response.json();
            workflows.push(metadata);
          }
        } catch (error) {
          // Skip workflows that aren't available
          continue;
        }
      }

      return { workflows };
    } catch (error) {
      return { workflows: [] };
    }
  }
}
