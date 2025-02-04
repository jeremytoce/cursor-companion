const path = require('path');
const logger = require('../utils/logger');
const fileHandler = require('../utils/file-handler');

const TEMPLATE_DIR = path.join(__dirname, '../templates');

async function init() {
  const projectDir = process.cwd();
  const targetDir = path.join(projectDir, 'cursor-companion');

  try {
    // Validate project directory
    await fileHandler.validateProjectDir(projectDir);

    // Check if already initialized
    const isInitialized = await fileHandler.isInitialized(projectDir);
    if (isInitialized) {
      logger.warning('cursor-companion is already initialized in this project');
      logger.info('To reinstall, please remove the cursor-companion directory first');
      return;
    }

    // Create cursor-companion directory
    logger.info('Initializing cursor-companion...');
    await fileHandler.ensureDir(targetDir);

    // Copy template files
    await fileHandler.copyTemplates(TEMPLATE_DIR, targetDir);

    logger.success('Successfully initialized cursor-companion!');
    logger.info('Templates are now available in the cursor-companion directory');
    logger.info('Run `cursor-companion --help` to see available commands');

  } catch (error) {
    if (error.code === 'EACCES') {
      logger.error('Permission denied. Please check directory permissions');
    } else {
      logger.error(`Failed to initialize cursor-companion: ${error.message}`);
    }
    throw error;
  }
}

module.exports = init; 