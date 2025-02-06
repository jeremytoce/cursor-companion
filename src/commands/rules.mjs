import logger from '../utils/logger.mjs';
import RuleUtils from '../utils/ruleUtils.mjs';
import chalk from 'chalk';
import BaseCommand from './base.mjs';

/**
 * Command handler for rule operations
 * Handles CLI interactions for rule management
 */
export default class RuleCommands extends BaseCommand {
  constructor(projectRoot) {
    super(projectRoot, 'rule', RuleUtils, {
      // Custom messages
      installSuccess: (name) => `Successfully installed ${name} rule`,
      uninstallSuccess: (name) => `Successfully uninstalled ${name} rule`,
      listHeader: 'Installed rules:',
      availableHeader: 'Available rules:',
      availableItem: (rule, status) => `- ${chalk.cyan(rule.name)} ${status}`,
    });
  }

  /**
   * Display rule info
   * @protected
   */
  displayInfo(metadata) {
    // Basic info
    logger.info(`Rule: ${metadata.name}`);
    logger.info(`Version: ${metadata.version}`);
    logger.info(`Author: ${metadata.author}`);
    logger.info(`Description: ${metadata.description}`);

    // Tags
    if (metadata.tags?.length) {
      logger.info('\nTags:');
      metadata.tags.forEach((tag) => logger.info(`- ${tag}`));
    }

    // Available rules
    if (metadata.rules?.length) {
      logger.info('\nAvailable Rules:');
      metadata.rules.forEach((rule) => {
        logger.info(`\n@${chalk.cyan(rule.name)}`);
        logger.info(chalk.gray(`  ${rule.description}`));
        if (rule.patterns?.length) {
          logger.info(chalk.gray('  Patterns:'));
          rule.patterns.forEach((pattern) => logger.info(chalk.gray(`    - ${pattern}`)));
        }
      });
    }
  }
}
