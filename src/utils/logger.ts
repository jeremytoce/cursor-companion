import chalk from 'chalk';

class Logger {
  public info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  public success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  public warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  public error(message: string): void {
    // Log errors in red and make them more visible
    console.error(chalk.red('✖'), chalk.red(message));
  }

  public debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🔍'), message);
    }
  }
}

// Export a singleton instance
export default new Logger();
