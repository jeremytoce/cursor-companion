import fs from 'fs-extra';
import path from 'path';
import init from '../../src/commands/init.mjs';
import PackUtils from '../../src/utils/packUtils.mjs';
import fileUtils from '../../src/utils/fileUtils.js';
import logger from '../../src/utils/logger.mjs';
import enquirer from 'enquirer';

jest.mock('fs-extra');
jest.mock('path');
jest.mock('../../src/utils/packUtils.mjs');
jest.mock('../../src/utils/fileUtils.mjs');
jest.mock('../../src/utils/logger.mjs');
jest.mock('enquirer');

describe('init command', () => {
  const mockCwd = '/project';
  const mockCursorDir = '/project/cursor-companion';

  beforeEach(() => {
    jest.clearAllMocks();
    process.cwd = jest.fn().mockReturnValue(mockCwd);
    path.join.mockImplementation((...args) => args.join('/'));
    enquirer.prompt = jest.fn().mockResolvedValue({ overwrite: true });
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

    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    await init();

    expect(logger.error).toHaveBeenCalledWith('Failed to initialize cursor-companion');
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
