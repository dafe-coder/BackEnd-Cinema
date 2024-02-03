import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(3, {
    message: 'Passport min length must 3 symbols',
  })
  password: string
}
