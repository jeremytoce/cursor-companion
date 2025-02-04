const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { copyTemplates } = require('../utils/copy');
const logger = require('../utils/logger');

async function init() {
  logger.info('Initializing cursor-companion...');

  try {
    // Create cursor-companion directory
    const targetDir = path.join(process.cwd(), 'cursor-companion');
    
    // Check if directory already exists
    if (await fs.pathExists(targetDir)) {
      logger.warning('cursor-companion directory already exists');
      const overwrite = await askOverwrite();
      if (!overwrite) {
        logger.info('Installation cancelled');
        return;
      }
    }

    // Copy templates
    await copyTemplates(targetDir);

    // Create features directory
    const featuresDir = path.join(targetDir, 'features');
    await fs.ensureDir(featuresDir);

    logger.success('Successfully installed Cursor workflow templates!');
    console.log('\nTemplates installed in:', chalk.blue(targetDir));
    console.log('\nDirectory structure created:');
    console.log(chalk.blue('cursor-companion/'));
    console.log(chalk.blue('├── templates/'));
    console.log(chalk.blue('└── features/'));
    console.log('\nUse', chalk.yellow('cursor-companion --help'), 'for available commands');
  } catch (error) {
    logger.error('Failed to initialize cursor-companion: ' + error.message);
    logger.error(error.message);
    process.exit(1);
  }
}

async function askOverwrite() {
  const { prompt } = require('enquirer');
  const response = await prompt({
    type: 'confirm',
    name: 'overwrite',
    message: 'Directory already exists. Do you want to overwrite?',
    initial: false
  });
  return response.overwrite;
}

module.exports = init; 