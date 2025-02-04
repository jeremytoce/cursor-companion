const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const fileHandler = require('../utils/file-handler');
const logger = require('../utils/logger');

async function init() {
  logger.info('Installing Cursor workflow templates...');

  try {
    // Create cursor-companion directory
    const targetDir = path.join(process.cwd(), 'cursor-companion');
    
    // Check if directory already exists
    if (await fileHandler.isInitialized(process.cwd())) {
      logger.warning('cursor-companion directory already exists');
      const overwrite = await askOverwrite();
      if (!overwrite) {
        logger.info('Installation cancelled');
        return;
      }
      // If overwriting, remove existing directory
      await fs.remove(targetDir);
      logger.info('Removed existing cursor-companion directory');
    }

    // Copy templates
    await fileHandler.copyTemplates(targetDir);

    // Create features directory
    const featuresDir = path.join(targetDir, 'features');
    await fileHandler.ensureDir(featuresDir);

    logger.success('Successfully installed Cursor workflow templates!');
    console.log('\nTemplates installed in:', chalk.blue(targetDir));
    console.log('\nDirectory structure created:');
    console.log(chalk.blue('cursor-companion/'));
    console.log(chalk.blue('├── templates/'));
    console.log(chalk.blue('└── features/'));
    console.log('\nUse', chalk.yellow('cursor-companion --help'), 'for available commands');
  } catch (error) {
    logger.error('Failed to install templates');
    logger.error(error.message);
    process.exit(1);
  }
}

async function askOverwrite() {
  try {
    const { prompt } = require('enquirer');
    const response = await prompt({
      type: 'confirm',
      name: 'overwrite',
      message: 'Directory already exists. Do you want to overwrite?',
      initial: false
    });
    return response.overwrite;
  } catch (error) {
    logger.error('Failed to get user input');
    throw error;
  }
}

module.exports = init; 