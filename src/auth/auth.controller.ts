import {
	Body,
	Controller,
	Post,
	Get,
	UsePipes,
	ValidationPipe,
	HttpCode,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { User } from 'src/user/user.model'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly AuthService: AuthService) {}

	@Post('register')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async register(@Body() dto: AuthDto) {
		return this.AuthService.register(dto)
	}

	@Get('users')
	async getAllUser(): Promise<User[]> {
		return this.AuthService.getAllUser()
	}

	@Post('login')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async login(@Body() dto: AuthDto) {
		const user = this.AuthService.login(dto)
		return user
	}

	@Post('login/access-token')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.AuthService.getNewTokens(dto)
	}
}
