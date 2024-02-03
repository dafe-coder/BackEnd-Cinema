import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/updateUser.dto'
import { IdValidationPipe } from 'src/pipes/idValidation.pipe'
import { User as UserM } from './user.model'
import { Schema, Types } from 'mongoose'

@Controller('users')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') userID: string): Promise<any> {
		return await this.UserService.byId(userID)
	}

	@Get('count')
	@Auth('admin')
	async getCount(): Promise<number> {
		return await this.UserService.getCount()
	}

	@Get('profile/favorites')
	@Auth()
	async getFavorites(@User('_id') userID: Types.ObjectId): Promise<any> {
		return await this.UserService.getFavorites(userID)
	}

	@Put('profile/favorites/:id')
	@HttpCode(200)
	@Auth()
	async toggleFavorites(
		@Param('id') movieID: Types.ObjectId,
		@User() user: UserM
	): Promise<any> {
		return await this.UserService.toggleFavorite(movieID, user)
	}

	@Get()
	@Auth('admin')
	async getUsers(@Query('searchTerm') searchTerm?: string): Promise<UserM[]> {
		return await this.UserService.getAllUser(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async getUser(@Param('id', IdValidationPipe) userID: string): Promise<UserM> {
		return await this.UserService.byId(userID)
	}

	@Put('profile')
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async updateProfile(@Body() dto: UpdateUserDto, @User('_id') userID: string) {
		return await this.UserService.updateProfile(userID, dto)
	}

	@Put(':id')
	@Auth('admin')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async updateAdmin(
		@Body() dto: UpdateUserDto,
		@Param('id', IdValidationPipe) userID: string
	) {
		return await this.UserService.updateProfile(userID, dto)
	}

	@Delete(':id')
	@Auth('admin')
	@HttpCode(200)
	async deleteUser(@Param('id', IdValidationPipe) userID: string) {
		return await this.UserService.deleteUser(userID)
	}
}
