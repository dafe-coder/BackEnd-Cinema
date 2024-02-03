import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

export const getJWTConfig = async (
  configServices: ConfigService
): Promise<JwtModuleOptions> => ({
  secret: configServices.get('JWT_SECRET'),
})
