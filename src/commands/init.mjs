import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import logger from '../utils/logger.mjs';
import PackUtils from '../utils/packUtils.mjs';
import fileUtils from '../utils/fileUtils.mjs';
import pkg from 'enquirer';

const { prompt } = pkg;

export default async function init() {
  const projectRoot = process.cwd();
  const rulesDir = path.join(projectRoot, '.cursor/rules');
  const workflowsDir = path.join(projectRoot, '.cursor/workflows');

  logger.info('Initializing .cursor directory...');

  try {
    // Validate project directory
    await fileUtils.validateProjectDir(projectRoot);

    // Check if already initialized
    if (await fileUtils.isInitialized(projectRoot)) {
      const { overwrite } = await prompt({
        type: 'confirm',
        name: 'overwrite',
        message: '.cursor directory already exists. Overwrite?',
        initial: false,
      });

      if (!overwrite) {
        logger.info('Installation cancelled');
        return;
      }
      await fs.remove(path.join(projectRoot, '.cursor'));
      logger.info('Removed existing .cursor directory');
    }

    // Create directory structure
    await fs.ensureDir(rulesDir);
    await fs.ensureDir(workflowsDir);

    // Install base pack
    logger.info('Installing base pack...');
    try {
      await PackUtils.installPack('base', projectRoot);
      logger.success('Base pack installed successfully');
    } catch (error) {
      logger.warning(
        'Failed to install base pack. You can install it later with: cursor-companion packs install -n base',
      );
      logger.debug(error.message);
    }

    logger.success('\nInitialization complete!');
    logger.info('\nDirectory structure created:');
    logger.info(chalk.blue('.cursor/'));
    logger.info(chalk.blue('├── rules/'));
    logger.info(chalk.blue('└── workflows/'));
    logger.info(chalk.blue('    └── base/'));

    logger.info('\nAvailable commands:');
    logger.info(`Use ${chalk.yellow('cursor-companion packs list')} to see installed packs`);
    logger.info(
      `Use ${chalk.yellow('cursor-companion packs install -n <pack-name>')} to install additional packs`,
    );
    logger.info(
      `Use ${chalk.yellow('cursor-companion registry set -u <url>')} to change the pack registry`,
    );
    logger.info(`Use ${chalk.yellow('cursor-companion --help')} for available commands`);

    logger.info(
      '\nReminder: Add .cursor/ to your .gitignore file to avoid committing workflow files',
    );
  } catch (error) {
    logger.error('Failed to initialize .cursor directory');
    logger.error(error.message);
    process.exit(1);
  }
}
