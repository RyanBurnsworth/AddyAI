import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('jsonwebtoken');

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    service = new JwtService();
    jest.clearAllMocks();
  });

  describe('decodeToken', () => {
    it('should decode and return the token payload when jwt.decode succeeds', () => {
      const token = 'valid.jwt.token';
      const decodedValue = { header: { alg: 'HS256' }, payload: { sub: '123' }, signature: 'sig' };

      // Mock jwt.decode to return decodedValue
      (jwt.decode as jest.Mock).mockReturnValue(decodedValue);

      const result = service.decodeToken(token);

      expect(jwt.decode).toHaveBeenCalledWith(token, { complete: true });
      expect(result).toBe(decodedValue);
    });

    it('should throw InternalServerErrorException when jwt.decode throws an error', () => {
      const token = 'invalid.jwt.token';
      const error = new Error('Invalid token');

      (jwt.decode as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => service.decodeToken(token)).toThrow(InternalServerErrorException);

      expect(consoleSpy).toHaveBeenCalledWith('Error decoding JWT:', error);

      consoleSpy.mockRestore();
    });
  });
});
