# Cursor Companion (cco)

A CLI tool for managing AI prompts and rules in Cursor. Cursor Companion helps you organize, install, and manage prompts and rules that enhance your development workflow.

## Installation

Install via npm:

```bash
npm install cursor-companion
```

## Quick Start

Initialize in your project:

```bash
cco init
```

This creates a `.cursor` directory with the following structure (if it doesn't exist):

```
.cursor/
├── prompts/     # AI prompts for code generation
└── rules/       # Rules for code standards
```

## Managing Prompts

Prompts are specialized templates that guide Cursor AI in generating or modifying code.

```bash
# List installed prompts
cco prompts list

# Show available prompts from registry
cco prompts available

# Show detailed prompt information
cco prompts info -n <package>
cco prompts info -n <package> -v  # verbose mode

# Install a prompt package
cco prompts install -n <package>

# Install a specific prompt from a package
cco prompts install -n <package>/<prompt>

# Uninstall a prompt
cco prompts uninstall -n <package>
```

## Managing Rules

Rules help enforce coding standards and best practices.

```bash
# List installed rules
cco rules list

# Show available rules
cco rules available

# Show rule details
cco rules info -n <rule>
cco rules info -n <rule> -v  # verbose mode

# Install a rule
cco rules install -n <rule>

# Uninstall a rule
cco rules uninstall -n <rule>
```

## Registry Management

Configure where prompts and rules are sourced from, The default registry is https://github.com/cursor-companion-library.

```bash
# Show current registry
cco registry get

# Set custom registry
cco registry set -u <url>
```

## Project Configuration

Add to your `.gitignore`:

```
.cursor/
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## License

MIT
