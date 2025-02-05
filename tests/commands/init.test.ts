import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import init from '@/commands/init';
import PackUtils from '@/utils/packUtils';
import fileUtils from '@/utils/fileUtils';
import logger from '@/utils/logger';
import Enquirer from 'enquirer';

// Mock all dependencies
vi.mock('fs-extra');
vi.mock('path');
vi.mock('@/utils/packUtils');
vi.mock('@/utils/fileUtils');
vi.mock('@/utils/logger');

// Mock enquirer with proper typing
vi.mock('enquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

// Add type assertions for mocked modules
const mockedPath = vi.mocked(path, true);
const mockedFileUtils = vi.mocked(fileUtils, true);
const mockedPackUtils = vi.mocked(PackUtils, true);
const mockedEnquirer = vi.mocked(Enquirer);

describe('init command', () => {
  const mockCwd = '/project';
  const mockCursorDir = '/project/cursor-companion';

  beforeEach(() => {
    vi.clearAllMocks();
    process.cwd = vi.fn().mockReturnValue(mockCwd);
    mockedPath.join.mockImplementation((...args: string[]) => args.join('/'));
    mockedEnquirer.prompt.mockResolvedValue({ overwrite: true });
  });

  it('should initialize new installation', async () => {
    mockedFileUtils.validateProjectDir.mockResolvedValue(true);
    mockedFileUtils.isInitialized.mockResolvedValue(false);
    mockedPackUtils.installPack.mockResolvedValue();

    await init();

    expect(fs.ensureDir).toHaveBeenCalledWith(`${mockCursorDir}/workflow-packs`);
    expect(mockedPackUtils.installPack).toHaveBeenCalledWith('base', mockCwd);
    expect(logger.success).toHaveBeenCalledWith('Base pack installed successfully');
  });

  it('should handle overwrite of existing installation', async () => {
    mockedFileUtils.validateProjectDir.mockResolvedValue(true);
    mockedFileUtils.isInitialized.mockResolvedValue(true);
    mockedPackUtils.installPack.mockResolvedValue();

    await init();

    expect(fs.remove).toHaveBeenCalledWith(mockCursorDir);
    expect(fs.ensureDir).toHaveBeenCalledWith(`${mockCursorDir}/workflow-packs`);
    expect(mockedPackUtils.installPack).toHaveBeenCalledWith('base', mockCwd);
  });

  it('should cancel installation if overwrite declined', async () => {
    mockedFileUtils.validateProjectDir.mockResolvedValue(true);
    mockedFileUtils.isInitialized.mockResolvedValue(true);
    mockedEnquirer.prompt.mockResolvedValue({ overwrite: false });

    await init();

    expect(fs.remove).not.toHaveBeenCalled();
    expect(fs.ensureDir).not.toHaveBeenCalled();
    expect(mockedPackUtils.installPack).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Installation cancelled');
  });

  it('should handle installation errors', async () => {
    mockedFileUtils.validateProjectDir.mockResolvedValue(true);
    mockedFileUtils.isInitialized.mockResolvedValue(false);
    mockedPackUtils.installPack.mockRejectedValue(new Error('Install failed'));

    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    await init();

    expect(logger.error).toHaveBeenCalledWith('Failed to initialize cursor-companion');
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
