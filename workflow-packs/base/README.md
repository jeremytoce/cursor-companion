# Base Workflow Pack

## Overview

The base pack provides essential workflows that follow the product development lifecycle, from initialization through debugging and feature development.

## Included Workflows

### Project Initialization

- `@p.init` - Initialize new projects
  - Creates project structure
  - Generates PRD
  - Sets up documentation

### Feature Development

- `@p.feature` - Create new features
  - Feature requirements documentation
  - Milestone tracking
  - Implementation planning

### Code Generation

- `@p.code` - Generate implementation
  - Milestone-based development
  - Testing integration
  - Documentation updates

### Review & Validation

- `@p.review` - Review requirements
- `@p.validate` - Validate implementation

### Debugging

- `@p.debug` - Debug issues
- `@p.retro` - Analyze patterns

## Usage

The base pack is installed automatically with:

    cursor-companion init

## Integration

All workflows in this pack are designed to work together, following a complete development lifecycle:

1. Project Setup: `@p.init`
2. Feature Planning: `@p.feature`
3. Implementation: `@p.code`
4. Quality Assurance: `@p.validate`
5. Maintenance: `@p.debug` & `@p.retro`
