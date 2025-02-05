import PackCommands from '../../src/commands/packs.js';
import PackUtils from '../../src/utils/packUtils.mjs';
import fileUtils from '../../src/utils/fileUtils.mjs';

jest.mock('../../src/utils/fileUtils.mjs');
jest.mock('../../src/utils/packUtils.mjs');
jest.mock('../../src/utils/logger.mjs');
jest.mock('fs-extra');

describe('PackCommands', () => {
  const projectRoot = '/test/project';
  let packCommands;

  beforeEach(() => {
    packCommands = new PackCommands(projectRoot);
    jest.clearAllMocks();
    // Mock the static methods
    PackUtils.listInstalledPacks.mockReturnValue(['pack1', 'pack2']);
    PackUtils.getPackMetadata.mockReturnValue({
      name: 'test-pack',
      version: '1.0.0',
      author: 'Test Author',
      description: 'Test Description',
      templates: ['template1'],
    });
  });

  describe('install', () => {
    it('should validate project and install pack', async () => {
      fileUtils.validateProjectDir.mockResolvedValue(true);
      PackUtils.installPack.mockResolvedValue();

      await packCommands.install('test-pack');

      expect(fileUtils.validateProjectDir).toHaveBeenCalledWith(projectRoot);
      expect(PackUtils.installPack).toHaveBeenCalledWith('test-pack', projectRoot);
    });

    it('should handle installation errors', async () => {
      fileUtils.validateProjectDir.mockResolvedValue(true);
      PackUtils.installPack.mockRejectedValue(new Error('Install failed'));

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
      await packCommands.install('test-pack');

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('list', () => {
    it('should validate project and list packs', async () => {
      fileUtils.validateProjectDir.mockResolvedValue(true);
      // Mock listInstalledPacks to return synchronously
      PackUtils.listInstalledPacks.mockReturnValue(['pack1', 'pack2']);
      // Mock getPackMetadata to be called for each pack
      PackUtils.getPackMetadata
        .mockReturnValueOnce({ name: 'pack1', version: '1.0.0' })
        .mockReturnValueOnce({ name: 'pack2', version: '1.0.0' });

      await packCommands.list();

      expect(fileUtils.validateProjectDir).toHaveBeenCalledWith(projectRoot);
      expect(PackUtils.listInstalledPacks).toHaveBeenCalledWith(projectRoot);
      // Verify getPackMetadata was called for each pack
      expect(PackUtils.getPackMetadata).toHaveBeenNthCalledWith(1, 'pack1', projectRoot);
      expect(PackUtils.getPackMetadata).toHaveBeenNthCalledWith(2, 'pack2', projectRoot);
      expect(PackUtils.getPackMetadata).toHaveBeenCalledTimes(2);
    });

    it('should handle empty pack list', async () => {
      fileUtils.validateProjectDir.mockResolvedValue(true);
      PackUtils.listInstalledPacks.mockReturnValue([]);

      await packCommands.list();

      expect(PackUtils.getPackMetadata).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should validate project and show pack info', async () => {
      fileUtils.validateProjectDir.mockResolvedValue(true);
      PackUtils.getPackMetadata.mockResolvedValue({
        name: 'test-pack',
        version: '1.0.0',
        author: 'Test Author',
        description: 'Test Description',
        templates: ['template1'],
      });

      await packCommands.info('test-pack');

      expect(fileUtils.validateProjectDir).toHaveBeenCalledWith(projectRoot);
      expect(PackUtils.getPackMetadata).toHaveBeenCalledWith('test-pack', projectRoot);
    });
  });

  describe('handleCommand', () => {
    it('should handle install command', async () => {
      const options = { name: 'test-pack' };
      fileUtils.validateProjectDir.mockResolvedValue(true);
      PackUtils.installPack.mockResolvedValue();

      await PackCommands.handleCommand('install', options, projectRoot);

      expect(PackUtils.installPack).toHaveBeenCalledWith('test-pack', projectRoot);
    });

    it('should handle list command', async () => {
      fileUtils.validateProjectDir.mockResolvedValue(true);
      PackUtils.listInstalledPacks.mockResolvedValue(['pack1']);
      PackUtils.getPackMetadata.mockImplementation(() => ({
        version: '1.0.0',
      }));

      await PackCommands.handleCommand('list', {}, projectRoot);

      expect(PackUtils.listInstalledPacks).toHaveBeenCalledWith(projectRoot);
    });

    it('should handle info command', async () => {
      const options = { name: 'test-pack' };
      fileUtils.validateProjectDir.mockResolvedValue(true);
      PackUtils.getPackMetadata.mockResolvedValue({
        name: 'test-pack',
        version: '1.0.0',
        author: 'Test Author',
        description: 'Test Description',
        templates: [],
      });

      await PackCommands.handleCommand('info', options, projectRoot);

      expect(PackUtils.getPackMetadata).toHaveBeenCalledWith('test-pack', projectRoot);
    });

    it('should handle unknown commands', async () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await PackCommands.handleCommand('unknown', {}, projectRoot);

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should require pack name for install command', async () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await PackCommands.handleCommand('install', {}, projectRoot);

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should require pack name for info command', async () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await PackCommands.handleCommand('info', {}, projectRoot);

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('validation', () => {
    it('should handle project validation errors', async () => {
      fileUtils.validateProjectDir.mockRejectedValue(new Error('Invalid project'));
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await packCommands.list();

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
