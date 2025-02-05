import fs from 'fs-extra';
import PackUtils from '../../src/utils/packUtils.mjs';

jest.mock('fs-extra');

describe('PackUtils', () => {
  const projectRoot = '/test/project';
  const packName = 'test-pack';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPackMetadata', () => {
    it('should return pack metadata', async () => {
      const mockMetadata = {
        name: 'test-pack',
        version: '1.0.0',
        author: 'Test Author',
        description: 'Test Description',
        templates: ['template1']
      };

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockMetadata));

      const result = PackUtils.getPackMetadata(packName, projectRoot);
      expect(result).toEqual(mockMetadata);
    });

    it('should throw if pack not found', () => {
      fs.existsSync.mockReturnValue(false);

      expect(() => {
        PackUtils.getPackMetadata(packName, projectRoot);
      }).toThrow('Pack test-pack not found');
    });
  });

  describe('listInstalledPacks', () => {
    it('should return list of installed packs', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['pack1', 'pack2']);
      fs.statSync.mockReturnValue({ isDirectory: () => true });

      const result = PackUtils.listInstalledPacks(projectRoot);
      expect(result).toEqual(['pack1', 'pack2']);
    });

    it('should return empty array if no packs directory', () => {
      fs.existsSync.mockReturnValue(false);

      const result = PackUtils.listInstalledPacks(projectRoot);
      expect(result).toEqual([]);
    });
  });

  describe('installPack', () => {
    it('should install pack successfully', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }));

      await PackUtils.installPack(packName, projectRoot);

      expect(fs.ensureDir).toHaveBeenCalled();
      expect(fs.copy).toHaveBeenCalled();
    });

    it('should throw if source pack not found', async () => {
      fs.existsSync.mockReturnValue(false);

      await expect(PackUtils.installPack(packName, projectRoot))
        .rejects
        .toThrow(`Pack ${packName} not found`);
    });

    it('should throw if pack.json missing', async () => {
      fs.existsSync
        .mockReturnValueOnce(true)  // source directory exists
        .mockReturnValueOnce(false); // pack.json doesn't exist

      await expect(PackUtils.installPack(packName, projectRoot))
        .rejects
        .toThrow(`Invalid pack: missing pack.json`);
    });
  });
}); 