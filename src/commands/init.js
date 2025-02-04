const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const logger = require('../utils/logger');
const PackUtils = require('../utils/packUtils');
const fileUtils = require('../utils/fileUtils');

async function init() {
  const projectRoot = process.cwd();
  const cursorCompanionDir = path.join(projectRoot, 'cursor-companion');

  logger.info('Initializing cursor-companion...');

  try {
    // Validate project directory
    await fileUtils.validateProjectDir(projectRoot);

    // Check if already initialized
    if (await fileUtils.isInitialized(projectRoot)) {
      const { prompt } = require('enquirer');
      const { overwrite } = await prompt({
        type: 'confirm',
        name: 'overwrite',
        message: 'cursor-companion already exists. Overwrite?',
        initial: false
      });

      if (!overwrite) {
        logger.info('Installation cancelled');
        return;
      }
      await fs.remove(cursorCompanionDir);
      logger.info('Removed existing cursor-companion directory');
    }

    // Create directory structure
    await fs.ensureDir(path.join(cursorCompanionDir, 'workflow-packs'));

    // Install base pack
    logger.info('Installing base pack...');
    await PackUtils.installPack('base', projectRoot);
    logger.success('Base pack installed successfully');

    logger.success('\nInitialization complete!');
    console.log('\nDirectory structure created:');
    console.log(chalk.blue('cursor-companion/'));
    console.log(chalk.blue('└── workflow-packs/'));
    console.log(chalk.blue('    └── base/'));
    
    console.log('Use', chalk.yellow('cursor-companion packs list'), 'to see installed packs');
    console.log('Use', chalk.yellow('cursor-companion packs install -n <pack-name>'), 'to install additional packs');
    console.log('Use', chalk.yellow('cursor-companion --help'), 'for available commands');
  } catch (error) {
    logger.error('Failed to initialize cursor-companion');
    logger.error(error.message);
    process.exit(1);
  }
}

module.exports = init; 