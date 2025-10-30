import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  decodeToken(token: string): any {
    try {
      // Decode the JWT without verifying the signature (for public use only)
      const decoded = jwt.decode(token, { complete: true });
      return decoded;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      throw new InternalServerErrorException('Error decoding JWT token: ', error);
    }
  }
}
