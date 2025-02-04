const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');

const fileHandler = {
  /**
   * Check if directory exists, create if it doesn't
   */
  ensureDir: async (dirPath) => {
    try {
      await fs.ensureDir(dirPath);
      return true;
    } catch (error) {
      logger.error(`Failed to create directory: ${error.message}`);
      throw error;
    }
  },

  /**
   * Copy template files to destination
   */
  copyTemplates: async (sourcePath, destPath) => {
    if (!await fs.pathExists(sourcePath)) {
      logger.error(`Template directory not found: ${sourcePath}`);
      throw new Error('Template directory not found');
    }

    const spinner = logger.startSpinner('Copying template files...');
    try {
      await fs.copy(sourcePath, destPath, {
        overwrite: false,
        errorOnExist: false,
      });
      logger.stopSpinner(spinner);
      return true;
    } catch (error) {
      logger.stopSpinner(spinner);
      logger.error(`Failed to copy templates: ${error.message}`);
      throw error;
    }
  },

  /**
   * Check if cursor-companion is already initialized
   */
  isInitialized: async (projectPath) => {
    try {
      return await fs.pathExists(path.join(projectPath, 'cursor-companion'));
    } catch (error) {
      logger.error(`Failed to check initialization: ${error.message}`);
      throw error;
    }
  },

  /**
   * Validate project directory
   */
  validateProjectDir: async (projectPath) => {
    try {
      const stats = await fs.stat(projectPath);
      if (!stats.isDirectory()) {
        throw new Error('Not a directory');
      }
      await fs.access(projectPath, fs.constants.W_OK);
      return true;
    } catch (error) {
      logger.error(`Invalid project directory: ${error.message}`);
      throw error;
    }
  }
};

module.exports = fileHandler; 