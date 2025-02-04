/**
 * File handling utilities for cursor-companion
 * @module fileUtils
 */

const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');

const fileUtils = {
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

module.exports = fileUtils; 