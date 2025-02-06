# Cursor Companion

An experimental workflow manager for prompt-based development in Cursor. At the heart of cursor-companion is the ability to create, manage, and publish workflows that can be proided as context to Cursor. Workflows are prompts that provide additional context to Cursor to be executed either standalone, or in a sequential manner.

## Installation

Install globally via npm:

```bash
npm install -g cursor-companion
```

## Usage

Initialize cursor-companion in your project:

### Installing Packs

You can install additional workflow packs using: `cursor-companion packs install -n <pack-name>`

You can also initialize with specific packs:

```bash
cursor-companion init --packs="pack1,pack2"
```

Show available commands and usage:

```bash
cursor-companion --help
```

List installed packs:

```bash
cursor-companion packs list
```

List available workflows:

```bash
cursor-companion packs available
```

Install a specified pack:

```bash
cursor-companion packs install -n <pack-name>
```

Show pack information:

```bash
cursor-companion packs info -n <pack-name>
```

Shows the current version:

```bash
cursor-companion --version
```

For detailed information about available workflows in each pack, see the README.md in the respective pack's directory under `workflow-packs/`.

## Project Structure

When initialized, cursor-companion creates the following structure:

```text
.cursor/
├── rules/           # Rules downloaded from cursor-companion-library
└── workflows/       # Workflow packs downloaded from cursor-companion-library
    └── base/        # Core workflows (installed by default)
    └── [other-packs] # Additional installed packs
```

## Workflow Packs

Cursor Companion uses a pack-based system to organize workflows. Each pack contains a set of specialized templates for different development scenarios. Each pack has its own README.md with detailed documentation in its directory under `workflow-packs/`.

Workflow packs are downloaded from the [cursor-companion-library](https://github.com/jeremytoce/cursor-companion-library) repository.

### Available Packs

| Pack Name        | Description                                            | Status       | Installation                      |
| ---------------- | ------------------------------------------------------ | ------------ | --------------------------------- |
| `base`           | Core development workflows following product lifecycle | Experimental | Installed by default              |
| `code-coverage`  | Code coverage analysis and reporting                   | Experimental | `packs install -n code-coverage`  |
| `security-audit` | Security scanning and vulnerability assessment         | Experimental | `packs install -n security-audit` |

## Workflows

Workflows are a way to kick off a series of guided prompts in Cursor. Each workflow represents a different stage of development,
which are triggered by typing `@p.` followed by the workflow name. Through my experimentation, I've found that this is a way to
aid in development speed, code quality, and overall completeness. This uses a human-in-the-loop approach to guide the AI to generate better results.

These workflows are designed to be used in conjunction with [Cursor AI](https://www.cursor.com/ai).

_This is not perfect._ I am still experimenting with the workflow lifecycle and how to best facilitate the prompts to get the best results.

## License

MIT

# Cursor Companion Library

Official library of rules and workflows for cursor-companion.

## Structure

### Rules

Collection of rules for Cursor AI. [Browse rules](rules/README.md)

### Workflows

Collection of workflow packs for different development scenarios. [Browse workflows](workflows/README.md)

## Usage

Install workflow packs using cursor-companion:

```bash
# Install base pack
cursor-companion packs install -n base

# Install additional packs
cursor-companion packs install -n code-coverage
cursor-companion packs install -n security-audit
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add or modify rules/workflows following the directory structure
4. Submit a pull request
