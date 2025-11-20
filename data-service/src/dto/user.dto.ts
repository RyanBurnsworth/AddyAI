import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  picture: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsNumber()
  @IsOptional()
  expiresIn?: number;

  @IsNumber()
  @IsOptional()
  refreshTokenExpiresIn?: number;

  @IsString()
  @IsOptional()
  tokenType?: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  @IsOptional()
  idToken?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean =  true;

  @IsString()
  @IsOptional()
  modelPreference?: string;
}
