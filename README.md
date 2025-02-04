# Cursor Companion

An experimental workflow manager for prompt-based development in Cursor. 

## Installation

Install globally via npm:

    npm install -g cursor-companion

## Workflow Packs
Cursor Companion uses a pack-based system to organize workflows. Each pack contains a set of specialized templates for different development scenarios.

### Base Pack
The base pack is installed by default and includes essential workflows for project initialization, debugging, and feature development. It mimics the product development lifecycle.

### Installing Packs
You can install additional workflow packs using:
    cursor-companion packs install -n <pack-name>

### Managing Packs
- List installed packs: `cursor-companion packs list`
- View pack details: `cursor-companion packs info -n <pack-name>`

### Project Structure
When initialized, cursor-companion creates the following structure:

    cursor-companion/
    └── workflow-packs/
        └── base/         # Core workflows (installed by default)
        └── [other-packs] # Additional installed packs

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

You can also initialize with specific packs:

    cursor-companion init --packs="pack1,pack2"

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

- Pack-based workflow management
- Easy template installation
- Project initialization
- Template management
- Customizable development workflows

## Commands

### init
Initializes cursor-companion in your project directory:

    cursor-companion init

### packs
Manage workflow packs:

    cursor-companion packs list           # List installed packs
    cursor-companion packs install -n <pack-name>  # Install a pack
    cursor-companion packs info -n <pack-name>     # Show pack information

### --help
Shows available commands and usage:

    cursor-companion --help

### --version
Shows the current version:

    cursor-companion --version


## License

MIT 