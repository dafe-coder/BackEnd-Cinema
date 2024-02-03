import {
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { hash, compare, genSalt } from 'bcryptjs'

import { User } from 'src/user/user.model'
import { AuthDto } from './dto/auth.dto'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private readonly UserModel: Model<User>,
		private readonly jwtService: JwtService
	) {}

	async register(dto: AuthDto) {
		const salt = await genSalt(10)
		const newUser = new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt),
		})
		await newUser.save()

		const tokens = await this.issueTokenPair(String(newUser._id))
		return {
			user: this.responseUser(newUser),
			...tokens,
		}
	}

	async getAllUser(): Promise<User[]> {
		const users = this.UserModel.find()
		return users
	}

	async login(dto: AuthDto) {
		const user = await this.UserModel.findOne({
			email: dto.email,
		})
		if (!user) {
			throw new HttpException('User doesn`t found', HttpStatus.NOT_FOUND)
		}
		const isComparePassword = await compare(dto.password, user.password)
		if (!isComparePassword) {
			throw new HttpException('Incorrect password!', HttpStatus.NOT_FOUND)
		}
		const tokens = await this.issueTokenPair(String(user._id))
		return {
			user: this.responseUser(user),
			...tokens,
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException('Pls sign in!')

		const result = await this.jwtService.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid token or expired!')

		const user = await this.UserModel.findById(result._id)

		const tokens = await this.issueTokenPair(String(user._id))
		return {
			user: this.responseUser(user),
			...tokens,
		}
	}

	async issueTokenPair(userID: string) {
		const data = { _id: userID }
		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d',
		})
		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		})
		return { accessToken, refreshToken }
	}

	responseUser(user: User) {
		return {
			_id: user.id,
			email: user.email,
			isAdmin: user.isAdmin,
		}
	}
}
