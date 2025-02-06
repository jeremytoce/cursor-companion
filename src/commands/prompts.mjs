import logger from '../utils/logger.mjs';
import PromptUtils from '../utils/promptUtils.mjs';
import chalk from 'chalk';
import { DisplayFormatter as fmt } from '../utils/formatters.mjs';
import BaseCommand from './base.mjs';

/**
 * Command handler for prompt operations
 * Handles CLI interactions for prompt management
 */
export default class PromptCommands extends BaseCommand {
  constructor(projectRoot) {
    super(projectRoot, 'prompt', PromptUtils, {
      installSuccess: (name) => `Successfully installed ${name} prompt`,
      uninstallSuccess: (name) => `Successfully uninstalled ${name} prompt`,
      listHeader: 'Installed prompts:',
      availableHeader: 'Available prompts:',
      availableItem: (prompt, status) => `- ${chalk.cyan(prompt.name)} ${status}`,
    });
  }

  /**
   * Display prompt info
   * @protected
   */
  displayInfo(metadata) {
    // Header
    logger.info(fmt.formatHeader('Prompt Package'));
    logger.info(fmt.formatField('Name', metadata.name));
    logger.info(fmt.formatField('Version', metadata.version));
    logger.info(fmt.formatField('Author', metadata.author));
    logger.info(fmt.formatField('Description', metadata.description));

    // Tags
    if (metadata.tags?.length) {
      logger.info(fmt.formatHeader('Tags'));
      logger.info(fmt.formatTags(metadata.tags));
    }

    // Prompts
    if (metadata.prompts?.length) {
      logger.info(fmt.formatHeader('Available Prompts'));

      metadata.prompts.forEach((prompt, index) => {
        if (index > 0) logger.info(fmt.formatSeparator());
        logger.info(fmt.formatPrompt(prompt.name));
        fmt
          .wrapText(prompt.description)
          .forEach((line) => logger.info(fmt.formatDescription(line)));
      });
    }

    // Footer
    logger.info('\n' + fmt.formatSeparator());
    logger.info(fmt.formatField('Install', `cco prompts install -n ${metadata.name}\n`));
  }
}
