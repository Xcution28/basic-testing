// Uncomment the code below and write your tests
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from ".";
import * as path from 'path';
import { existsSync } from "fs";
import { readFile } from "fs/promises";

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path', () => ({
  join: jest.fn(() => 'mockedPath'),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);

    expect(setTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;

    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, interval);

    expect(setInterval).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mock_path_to_file = 'test.txt';
  const mock_full_path = '/src/path/test.txt';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    jest.spyOn(path, 'join').mockReturnValue(mock_full_path);
    (existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously(mock_path_to_file);

    expect(path.join).toHaveBeenCalledWith(__dirname, mock_path_to_file);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(path, 'join').mockReturnValue(mock_full_path);
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(mock_path_to_file);

    expect(result).toBeNull();
    expect(existsSync).toHaveBeenCalledWith(mock_full_path);
  });

  test('should return file content if file exists', async () => {
    const mockFileContent = Buffer.from('File content');

    jest.spyOn(path, 'join').mockReturnValue(mock_full_path);
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(mockFileContent);

    const result = await readFileAsynchronously(mock_path_to_file);

    expect(result).toBe('File content');
    expect(existsSync).toHaveBeenCalledWith(mock_full_path);
    expect(readFile).toHaveBeenCalledWith(mock_full_path);
  });
});
