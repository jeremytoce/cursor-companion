/**
 * File handling utilities for cursor-companion
 * @module fileHandler
 */

const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');

const fileHandler = {
  /**
   * Ensures a directory exists, creates it if it doesn't
   * @param {string} dirPath - Path to the directory
   * @returns {Promise<boolean>} True if successful
   * @throws {Error} If directory creation fails
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
   * Copies template files to the target directory
   * @param {string} targetDir - Destination directory for templates
   * @returns {Promise<boolean>} True if successful, false if no templates found
   * @throws {Error} If template copying fails
   */
  copyTemplates: async (targetDir) => {
    // Get the templates directory path
    const templatesDir = path.join(__dirname, '../../templates');
    
    if (!await fs.pathExists(templatesDir)) {
      logger.error(`Template directory not found: ${templatesDir}`);
      throw new Error('Template directory not found');
    }

    try {
      // Ensure the target directory exists
      await fs.ensureDir(targetDir);
      
      // Create templates subdirectory
      const targetTemplatesDir = path.join(targetDir, 'templates');
      await fs.ensureDir(targetTemplatesDir);

      // Copy template files
      const templateFiles = await fs.readdir(templatesDir);
      
      if (templateFiles.length === 0) {
        logger.warning('No template files found to copy');
        return false;
      }

      for (const file of templateFiles) {
        const sourcePath = path.join(templatesDir, file);
        const targetPath = path.join(targetTemplatesDir, file);
        
        // Skip if not a file
        const stats = await fs.stat(sourcePath);
        if (!stats.isFile()) {
          logger.debug(`Skipping non-file: ${file}`);
          continue;
        }
        
        await fs.copy(sourcePath, targetPath, {
          overwrite: false,
          errorOnExist: false,
        });
        logger.debug(`Copied template: ${file}`);
      }
      
      logger.success('Successfully copied template files');
      return true;
    } catch (error) {
      logger.error(`Failed to copy templates: ${error.message}`);
      throw error;
    }
  },

  /**
   * Checks if cursor-companion is already initialized in the project
   * @param {string} projectPath - Path to the project directory
   * @returns {Promise<boolean>} True if initialized
   * @throws {Error} If check fails
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
   * Validates that the project directory exists and is writable
   * @param {string} projectPath - Path to validate
   * @returns {Promise<boolean>} True if valid
   * @throws {Error} If directory is invalid or not writable
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