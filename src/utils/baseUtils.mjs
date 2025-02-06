import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
import logger from './logger.mjs';

/**
 * Base utility class for managing components (packs/rules)
 * Provides core functionality for installation, listing, and management
 */
export default class BaseUtils {
  /** Registry configuration */
  static REGISTRY = {
    url: 'https://raw.githubusercontent.com/jeremytoce/cursor-companion-library/main',
    api: 'https://api.github.com/repos/jeremytoce/cursor-companion-library/contents',
  };

  /** File system configuration */
  static FS = {
    baseDir: '.cursor',
    metadataFile: 'cco_manifest.json',
    configFile: '.cursor/config.json',
  };

  /** Error messages */
  static Errors = {
    component: {
      INVALID_NAME: (type, name) => `Invalid ${type} name: ${name}`,
      NOT_FOUND: (type, name) => `${type} '${name}' not found locally or in registry`,
      ALREADY_INSTALLED: (type, name) => `${type} '${name}' is already installed`,
      NOT_INSTALLED: (type, name) => `${type} '${name}' is not installed`,
      INVALID_NAME: (type, name, reason) => `Invalid ${type} name '${name}': ${reason}`,
    },
    network: {
      REGISTRY: (msg) => `Registry error: ${msg}`,
      API: (msg) => `GitHub API error: ${msg}`,
      UNREACHABLE: () => 'Registry not accessible',
    },
  };

  /**
   * Validate component name
   * @private
   */
  static validateName(name, type) {
    if (!name) {
      throw new Error(this.Errors.component.INVALID_NAME(type, name, 'name is required'));
    }
    if (typeof name !== 'string') {
      throw new Error(this.Errors.component.INVALID_NAME(type, name, 'must be a string'));
    }

    // Split into package and component names
    const parts = name.split('/');
    if (parts.length > 2) {
      throw new Error(
        this.Errors.component.INVALID_NAME(type, name, 'invalid format. Use package/prompt'),
      );
    }

    // Validate each part
    parts.forEach((part) => {
      if (!/^[a-z0-9-_\.]+$/i.test(part)) {
        throw new Error(
          this.Errors.component.INVALID_NAME(
            type,
            name,
            'can only contain letters, numbers, hyphens, dots and underscores',
          ),
        );
      }
    });
  }

  /**
   * Get component paths and options
   * @private
   */
  static getOptions(type, subDir) {
    return {
      type,
      dir: path.join(this.FS.baseDir, subDir),
      apiPath: subDir,
      metadataFile: this.FS.metadataFile,
    };
  }

  /**
   * Get registry URL from config or default
   * @private
   */
  static async getRegistryUrl(projectRoot) {
    try {
      const config = await fs.readJson(path.join(projectRoot, this.FS.configFile));
      return config.registry || this.REGISTRY.url;
    } catch {
      return this.REGISTRY.url;
    }
  }

  /**
   * Fetch component metadata
   * @private
   */
  static async fetchMetadata(url, type, name) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(this.Errors.component.NOT_FOUND(type, name));
      }
      return await response.json();
    } catch (error) {
      if (error.cause?.code === 'ENOTFOUND') {
        throw new Error(this.Errors.network.UNREACHABLE());
      }
      throw error;
    }
  }

  /**
   * Install a component
   */
  static async install(name, projectRoot = process.cwd(), options) {
    const { type, dir, metadataFile } = options;
    this.validateName(name, type);

    // Split into package and component names
    const [packageName, componentName] = name.split('/');
    const destPath = path.join(projectRoot, dir, packageName);
    const tempDir = `${destPath}.tmp`;

    try {
      // Check if already installed
      if (await fs.pathExists(path.join(destPath, metadataFile))) {
        if (!componentName) {
          throw new Error(this.Errors.component.ALREADY_INSTALLED(type, packageName));
        }
        // For individual components, we'll overwrite
      }

      // Get metadata
      const registry = await this.getRegistryUrl(projectRoot);
      const sourceUrl = `${registry}/${type}s/${packageName}`;
      const metadata = await this.fetchMetadata(`${sourceUrl}/${metadataFile}`, type, packageName);

      // If installing specific component, validate it exists
      if (componentName) {
        const component = metadata[type + 's']?.find((c) => c.name === componentName);
        if (!component) {
          throw new Error(`${type} '${componentName}' not found in package '${packageName}'`);
        }
        // Update metadata to only include this component
        metadata[type + 's'] = [component];
      }

      // Install files
      await fs.ensureDir(tempDir);
      await fs.writeJson(path.join(tempDir, metadataFile), metadata, { spaces: 2 });

      // Download component files
      if (componentName) {
        const response = await fetch(`${sourceUrl}/${componentName}`);
        if (!response.ok) {
          throw new Error(`Failed to download ${type} file: ${response.statusText}`);
        }
        const content = await response.text();
        await fs.writeFile(path.join(tempDir, componentName), content);
      } else {
        // Download all files for full package install
        if (metadata.files?.length) {
          await Promise.all(
            metadata.files.map(async (file) => {
              const response = await fetch(`${sourceUrl}/${file}`);
              if (response.ok) {
                const content = await response.text();
                await fs.writeFile(path.join(tempDir, file), content);
              }
            }),
          );
        }
      }

      // Atomic move
      await fs.move(tempDir, destPath, { overwrite: true });
      return true;
    } catch (error) {
      await fs.remove(tempDir).catch(() => {});
      await fs.remove(destPath).catch(() => {});
      throw error;
    }
  }

  /**
   * List installed components
   */
  static async listInstalled(projectRoot = process.cwd(), { dir, metadataFile }) {
    const componentsDir = path.join(projectRoot, dir);
    if (!(await fs.pathExists(componentsDir))) return [];

    const dirs = await fs.readdir(componentsDir);
    return dirs.filter((dir) => fs.pathExistsSync(path.join(componentsDir, dir, metadataFile)));
  }

  /**
   * List available components from registry
   */
  static async listAvailable(projectRoot = process.cwd(), { type, apiPath }) {
    try {
      const response = await fetch(`${this.REGISTRY.api}/${apiPath}`);
      if (!response.ok) {
        throw new Error(this.Errors.network.API(response.statusText));
      }

      const contents = await response.json();
      const registry = await this.getRegistryUrl(projectRoot);

      const items = await Promise.all(
        contents
          .filter((item) => item.type === 'dir')
          .map(async ({ name, path: itemPath }) => {
            try {
              const url = `${registry}/${itemPath}/${this.FS.metadataFile}`;
              const metadata = await this.fetchMetadata(url, type, name);
              return {
                name: metadata.name,
                version: metadata.version,
                author: metadata.author,
                description: metadata.description,
                tags: metadata.tags,
                promptCount: metadata.prompts?.length || 0,
              };
            } catch {
              return null;
            }
          }),
      );

      return { [type + 's']: items.filter(Boolean) };
    } catch (error) {
      logger.error(`Failed to list available ${type}s:`, error);
      return { [type + 's']: [] };
    }
  }

  /**
   * Get metadata for a component, trying both local and registry
   */
  static async getMetadata(name, projectRoot = process.cwd(), { type, dir, metadataFile }) {
    this.validateName(name, type);

    try {
      // Try local first
      const localPath = path.join(projectRoot, dir, name, metadataFile);
      if (await fs.pathExists(localPath)) {
        return await fs.readJson(localPath);
      }

      // If not found locally, try registry
      const registryUrl = await this.getRegistryUrl(projectRoot);
      const metadataUrl = `${registryUrl}/${type}s/${name}/${metadataFile}`;

      logger.debug(`Fetching from registry: ${metadataUrl}`);
      const response = await fetch(metadataUrl);

      if (!response.ok) {
        logger.debug(`Registry response: ${response.status} ${response.statusText}`);
        throw new Error(`Registry request failed (${response.status}): ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.debug(`Failed to get metadata: ${error.message}`);
      throw new Error(this.Errors.component.NOT_FOUND(type, name));
    }
  }

  static async loadConfig(projectRoot) {
    const configPath = path.join(projectRoot, this.FS.configFile);
    try {
      return await fs.readJson(configPath);
    } catch (error) {
      return {};
    }
  }

  /**
   * Uninstall a component
   */
  static async uninstall(name, projectRoot = process.cwd(), { type, dir, metadataFile }) {
    this.validateName(name, type);

    const componentPath = path.join(projectRoot, dir, name);
    if (!(await fs.pathExists(path.join(componentPath, metadataFile)))) {
      throw new Error(this.Errors.component.NOT_INSTALLED(type, name));
    }

    await fs.remove(componentPath);
    return true;
  }
}
