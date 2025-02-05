import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import init from '../../src/commands/init.mjs';
import PackUtils from '../../src/utils/packUtils.mjs';
import fileUtils from '../../src/utils/fileUtils.mjs';
import logger from '../../src/utils/logger.mjs';
import enquirer from 'enquirer';

// Replace jest.mock with vi.mock
vi.mock('fs-extra');
vi.mock('path');
vi.mock('../../src/utils/packUtils.mjs');
vi.mock('../../src/utils/fileUtils.mjs');
vi.mock('../../src/utils/logger.mjs');

// Use a module factory to properly mock enquirer's prompt method,
// exporting a default export so that "import pkg from 'enquirer'" works properly
vi.mock('enquirer', () => {
  return {
    default: {
      prompt: vi.fn(),
    },
  };
});

describe('init command', () => {
  const mockCwd = '/project';
  const mockCursorDir = '/project/cursor-companion';

  beforeEach(() => {
    vi.clearAllMocks();
    process.cwd = vi.fn().mockReturnValue(mockCwd);
    path.join.mockImplementation((...args) => args.join('/'));
    enquirer.prompt.mockResolvedValue({ overwrite: true });
  });

  it('should initialize new installation', async () => {
    fileUtils.validateProjectDir.mockResolvedValue(true);
    fileUtils.isInitialized.mockResolvedValue(false);
    PackUtils.installPack.mockResolvedValue();

    await init();

    expect(fs.ensureDir).toHaveBeenCalledWith(`${mockCursorDir}/workflow-packs`);
    expect(PackUtils.installPack).toHaveBeenCalledWith('base', mockCwd);
    expect(logger.success).toHaveBeenCalledWith('Base pack installed successfully');
  });

  it('should handle overwrite of existing installation', async () => {
    fileUtils.validateProjectDir.mockResolvedValue(true);
    fileUtils.isInitialized.mockResolvedValue(true);
    PackUtils.installPack.mockResolvedValue();

    await init();

    expect(fs.remove).toHaveBeenCalledWith(mockCursorDir);
    expect(fs.ensureDir).toHaveBeenCalledWith(`${mockCursorDir}/workflow-packs`);
    expect(PackUtils.installPack).toHaveBeenCalledWith('base', mockCwd);
  });

  it('should cancel installation if overwrite declined', async () => {
    fileUtils.validateProjectDir.mockResolvedValue(true);
    fileUtils.isInitialized.mockResolvedValue(true);
    enquirer.prompt.mockResolvedValue({ overwrite: false });

    await init();

    expect(fs.remove).not.toHaveBeenCalled();
    expect(fs.ensureDir).not.toHaveBeenCalled();
    expect(PackUtils.installPack).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Installation cancelled');
  });

  it('should handle installation errors', async () => {
    fileUtils.validateProjectDir.mockResolvedValue(true);
    fileUtils.isInitialized.mockResolvedValue(false);
    PackUtils.installPack.mockRejectedValue(new Error('Install failed'));

    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});
    await init();

    expect(logger.error).toHaveBeenCalledWith('Failed to initialize cursor-companion');
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
