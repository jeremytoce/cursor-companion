/**
 * Custom error for validation failures
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Custom error for network/registry issues
 */
export class RegistryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RegistryError';
  }
}

/**
 * Custom error for component operations
 */
export class ComponentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ComponentError';
  }
}

/**
 * Custom error for file system operations
 */
export class FileSystemError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileSystemError';
  }
}
