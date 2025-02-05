import { describe, it, expect, beforeEach, vi } from 'vitest';
import PackCommands from '@/commands/packs';
import PackUtils from '@/utils/packUtils';
import fileUtils from '@/utils/fileUtils';

vi.mock('@/utils/fileUtils');
vi.mock('@/utils/packUtils');
vi.mock('@/utils/logger');
vi.mock('fs-extra');

// Add mock type assertions
const mockedFileUtils = vi.mocked(fileUtils, true);
const mockedPackUtils = vi.mocked(PackUtils, true);

describe('PackCommands', () => {
  const projectRoot = '/test/project';
  let packCommands: PackCommands;

  beforeEach(() => {
    packCommands = new PackCommands(projectRoot);
    vi.clearAllMocks();

    mockedPackUtils.listInstalledPacks.mockReturnValue(['pack1', 'pack2']);
    mockedPackUtils.getPackMetadata.mockReturnValue({
      name: 'test-pack',
      version: '1.0.0',
      author: 'Test Author',
      description: 'Test Description',
      templates: ['template1'],
    });
  });

  describe('install', () => {
    it('should validate project and install pack', async () => {
      mockedFileUtils.validateProjectDir.mockResolvedValue(true);
      mockedPackUtils.installPack.mockResolvedValue();

      await packCommands.install('test-pack');

      expect(mockedFileUtils.validateProjectDir).toHaveBeenCalledWith(projectRoot);
      expect(mockedPackUtils.installPack).toHaveBeenCalledWith('test-pack', projectRoot);
    });

    it('should handle installation errors', async () => {
      mockedFileUtils.validateProjectDir.mockResolvedValue(true);
      mockedPackUtils.installPack.mockRejectedValue(new Error('Install failed'));

      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      await packCommands.install('test-pack');

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('list', () => {
    it('should validate project and list packs', async () => {
      mockedFileUtils.validateProjectDir.mockResolvedValue(true);
      // Mock listInstalledPacks to return synchronously
      mockedPackUtils.listInstalledPacks.mockReturnValue(['pack1', 'pack2']);
      // Mock getPackMetadata to be called for each pack
      mockedPackUtils.getPackMetadata
        .mockReturnValueOnce({
          name: 'pack1',
          version: '1.0.0',
          author: 'Test Author',
          description: 'Test Description',
          templates: [],
        })
        .mockReturnValueOnce({
          name: 'pack2',
          version: '1.0.0',
          author: 'Test Author',
          description: 'Test Description',
          templates: [],
        });

      await packCommands.list();

      expect(mockedFileUtils.validateProjectDir).toHaveBeenCalledWith(projectRoot);
      expect(mockedPackUtils.listInstalledPacks).toHaveBeenCalledWith(projectRoot);
      // Verify getPackMetadata was called for each pack
      expect(mockedPackUtils.getPackMetadata).toHaveBeenNthCalledWith(1, 'pack1', projectRoot);
      expect(mockedPackUtils.getPackMetadata).toHaveBeenNthCalledWith(2, 'pack2', projectRoot);
      expect(mockedPackUtils.getPackMetadata).toHaveBeenCalledTimes(2);
    });

    it('should handle empty pack list', async () => {
      mockedFileUtils.validateProjectDir.mockResolvedValue(true);
      mockedPackUtils.listInstalledPacks.mockReturnValue([]);

      await packCommands.list();

      expect(mockedPackUtils.getPackMetadata).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should validate project and show pack info', async () => {
      mockedFileUtils.validateProjectDir.mockResolvedValue(true);
      mockedPackUtils.getPackMetadata.mockResolvedValue({
        name: 'test-pack',
        version: '1.0.0',
        author: 'Test Author',
        description: 'Test Description',
        templates: ['template1'],
      });

      await packCommands.info('test-pack');

      expect(mockedFileUtils.validateProjectDir).toHaveBeenCalledWith(projectRoot);
      expect(mockedPackUtils.getPackMetadata).toHaveBeenCalledWith('test-pack', projectRoot);
    });
  });

  describe('handleCommand', () => {
    it('should handle install command', async () => {
      const options = { name: 'test-pack' };
      mockedFileUtils.validateProjectDir.mockResolvedValue(true);
      mockedPackUtils.installPack.mockResolvedValue();

      await PackCommands.handleCommand('install', options, projectRoot);

      expect(mockedPackUtils.installPack).toHaveBeenCalledWith('test-pack', projectRoot);
    });

    it('should handle list command', async () => {
      mockedFileUtils.validateProjectDir.mockResolvedValue(true);
      mockedPackUtils.listInstalledPacks.mockResolvedValue(['pack1']);
      mockedPackUtils.getPackMetadata.mockImplementation(() => ({
        name: 'pack1',
        version: '1.0.0',
        author: 'Test Author',
        description: 'Test Description',
        templates: [],
      }));

      await PackCommands.handleCommand('list', {}, projectRoot);

      expect(mockedPackUtils.listInstalledPacks).toHaveBeenCalledWith(projectRoot);
    });

    it('should handle info command', async () => {
      const options = { name: 'test-pack' };
      mockedFileUtils.validateProjectDir.mockResolvedValue(true);
      mockedPackUtils.getPackMetadata.mockResolvedValue({
        name: 'test-pack',
        version: '1.0.0',
        author: 'Test Author',
        description: 'Test Description',
        templates: [],
      });

      await PackCommands.handleCommand('info', options, projectRoot);

      expect(mockedPackUtils.getPackMetadata).toHaveBeenCalledWith('test-pack', projectRoot);
    });

    it('should handle unknown commands', async () => {
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      await PackCommands.handleCommand('unknown', {}, projectRoot);

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should require pack name for install command', async () => {
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      await PackCommands.handleCommand('install', {}, projectRoot);

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should require pack name for info command', async () => {
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      await PackCommands.handleCommand('info', {}, projectRoot);

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('validation', () => {
    it('should handle project validation errors', async () => {
      mockedFileUtils.validateProjectDir.mockRejectedValue(new Error('Invalid project'));
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      await packCommands.list();

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
