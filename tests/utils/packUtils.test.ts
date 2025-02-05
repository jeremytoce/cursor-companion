import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs-extra';
import PackUtils from '@/utils/packUtils';
import { Stats } from 'fs';

// Mock fs-extra with proper typing
vi.mock('fs-extra', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
    statSync: vi.fn(),
    ensureDir: vi.fn(),
    copy: vi.fn(),
  },
}));

// Type assertion for the mocked fs module
const mockedFs = vi.mocked(fs);

describe('PackUtils', () => {
  const projectRoot = '/test/project';
  const packName = 'test-pack';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPackMetadata', () => {
    it('should return pack metadata', async () => {
      const mockMetadata = {
        name: 'test-pack',
        version: '1.0.0',
        author: 'Test Author',
        description: 'Test Description',
        templates: ['template1'],
      };

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockMetadata));

      const result = PackUtils.getPackMetadata(packName, projectRoot);
      expect(result).toEqual(mockMetadata);
    });

    it('should throw if pack not found', () => {
      mockedFs.existsSync.mockReturnValue(false);

      expect(() => {
        PackUtils.getPackMetadata(packName, projectRoot);
      }).toThrow('Pack test-pack not found');
    });
  });

  describe('listInstalledPacks', () => {
    it('should return list of installed packs', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readdirSync.mockReturnValue(['pack1', 'pack2'] as unknown as fs.Dirent[]);
      mockedFs.statSync.mockReturnValue({
        isDirectory: () => true,
      } as unknown as Stats);

      const result = PackUtils.listInstalledPacks(projectRoot);
      expect(result).toEqual(['pack1', 'pack2']);
    });

    it('should return empty array if no packs directory', () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = PackUtils.listInstalledPacks(projectRoot);
      expect(result).toEqual([]);
    });
  });

  describe('installPack', () => {
    it('should install pack successfully', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }));

      await PackUtils.installPack(packName, projectRoot);

      expect(mockedFs.ensureDir).toHaveBeenCalled();
      expect(mockedFs.copy).toHaveBeenCalled();
    });

    it('should throw if source pack not found', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(PackUtils.installPack(packName, projectRoot)).rejects.toThrow(
        `Pack ${packName} not found`,
      );
    });

    it('should throw if pack.json missing', async () => {
      mockedFs.existsSync
        .mockReturnValueOnce(true) // source directory exists
        .mockReturnValueOnce(false); // pack.json doesn't exist

      await expect(PackUtils.installPack(packName, projectRoot)).rejects.toThrow(
        `Invalid pack: missing pack.json`,
      );
    });
  });
});
