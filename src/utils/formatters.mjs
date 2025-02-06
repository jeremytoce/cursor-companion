import chalk from 'chalk';

export class DisplayFormatter {
  static formatHeader(title) {
    return chalk.bold.blue(`\n📦 ${title}`);
  }

  static formatField(label, value) {
    return `${chalk.bold(`${label}: `)}${chalk.white(value)}`;
  }

  static formatTags(tags) {
    return tags.map((tag) => chalk.cyan(`#${tag}`)).join('  ');
  }

  static formatSeparator() {
    return chalk.gray('─'.repeat(50));
  }

  static formatPrompt(name) {
    return chalk.bold.cyan(`@${name}`);
  }

  static formatDescription(text) {
    return chalk.gray(text);
  }

  static wrapText(text, indent = 2, width = 60) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    words.forEach((word) => {
      if ((line + word).length > width) {
        lines.push(' '.repeat(indent) + line.trim());
        line = word + ' ';
      } else {
        line += word + ' ';
      }
    });
    if (line) {
      lines.push(' '.repeat(indent) + line.trim());
    }
    return lines;
  }
}
