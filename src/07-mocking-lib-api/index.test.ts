// Uncomment the code below and write your tests
import axios, { AxiosInstance } from "axios";
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const mockData = { data: 'check data' };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should create instance with provided base url', async () => {
    const axios_mock: Partial<AxiosInstance> = {
      get: jest.fn().mockResolvedValue({ data: mockData }),
    };

    const axios_create = jest.spyOn(axios, 'create').mockReturnValue(axios_mock as AxiosInstance);

    await throttledGetDataFromApi('/posts');

    expect(axios_create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const axios_mock: Partial<AxiosInstance> = {
      get: jest.fn().mockResolvedValue({ data: mockData }),
    };

    jest.spyOn(axios, 'create').mockReturnValue(axios_mock as AxiosInstance)

    await throttledGetDataFromApi('/posts');

    expect(axios_mock.get).toHaveBeenCalledWith('/posts');
  });

  test('should return response data', async () => {
    const axios_mock: Partial<AxiosInstance> = {
      get: jest.fn().mockResolvedValue({ data: mockData }),
    };

    jest.spyOn(axios, 'create').mockReturnValue(axios_mock as AxiosInstance);

    const result = await throttledGetDataFromApi('/posts');

    expect(result).toEqual(mockData);
  });
});
