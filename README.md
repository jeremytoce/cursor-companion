# Cursor Companion

A command-line tool that installs Cursor workflow templates.

## Installation

Install globally via npm:

    npm install -g cursor-companion

## Usage

Initialize cursor-companion in your project:

    cursor-companion init

## Features

- Easy template installation
- Project initialization
- Template management

## Commands

### init
Initializes cursor-companion in your project directory:

    cursor-companion init

### --help
Shows available commands and usage:

    cursor-companion --help

### --version
Shows the current version:

    cursor-companion --version

## Error Messages

If you encounter any errors, the CLI will provide clear error messages:

Already initialized:

    warning cursor-companion is already initialized in this project
    info To reinstall, please remove the cursor-companion directory first

Permission denied:

    error Permission denied. Please check directory permissions

## License

MIT 