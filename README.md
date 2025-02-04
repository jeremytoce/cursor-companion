# Cursor Companion

An experimental workflow manager for prompt-based development in Cursor. 

## Installation

Install globally via npm:

    npm install -g cursor-companion

## Workflows
Workflows are a way to kick off a series of guided prompts in Cursor. Each workflow represents a different stage of development,
which are triggered by typing `@p.` followed by the workflow name. Through my experimentation, I've found that this is a way to 
aid in development speed, code quality, and overall completeness. This uses a human-in-the-loop approach to guide the AI to generate better results.

These workflows are designed to be used in conjunction with the [Cursor AI](https://www.cursor.com/ai) and the [Cursor AI Code Editor](https://www.cursor.com/code).

This is not perfect. I am still expperimenting with the workflow lifecycle and how to best facilitate the prompts to get the best results.

The current logical flows are as follows:

### New Project
- @p.init
- @p.review
- @p.code
- @p.validate

### New Feature
- @p.feature
- @p.review
- @p.code
- @p.validate

### Debugging
- @p.debug
- @p.retro

## Usage

Initialize cursor-companion in your project:

    cursor-companion init

Then, use the following commands within Cursor to kick off a workflow:

1. `@p.init` - Start a new project
   - Creates project structure and PRD
   - Guides you through defining project goals, requirements, and architecture
   - Sets up initial project documentation and milestone tracking

2. `@p.feature` - Create a new feature
   - Creates feature documentation structure
   - Helps define feature requirements and specifications
   - Sets up feature-specific milestone tracking
   - Generates comprehensive feature documentation

3. `@p.debug` - Debug issues
   - Systematic issue investigation and resolution
   - Root cause analysis
   - Solution development and verification
   - Prevention recommendations

4. `@p.retro` - Analyze bug patterns
   - Reviews debugging sessions
   - Identifies common patterns
   - Improves debugging workflows
   - Creates prevention strategies

5. `@p.code` - Generate code
   - Implements features based on PRD/FRD
   - Follows milestone-based development
   - Includes testing and documentation
   - Maintains progress tracking

6. `@p.review` - Review requirements
   - Validates PRD completeness
   - Ensures technical feasibility
   - Clarifies requirements
   - Enhances documentation

7. `@p.validate` - Validate implementation
   - Reviews code against requirements
   - Checks test coverage
   - Validates functionality
   - Ensures quality standards

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