import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { genSalt, hash } from 'bcryptjs'
import { Model, Types } from 'mongoose'
import { UpdateUserDto } from './dto/updateUser.dto'
import { User } from './user.model'
@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private readonly UserModel: Model<User>) {}

	async byId(id: string): Promise<User> {
		const user = await this.UserModel.findById(id)
		if (!user) {
			throw new NotFoundException(`No such user with id ${id}`)
		}
		return user
	}

	async updateProfile(id: string, dto: UpdateUserDto) {
		const user = await this.byId(id)

		const isSameUser = await this.UserModel.findOne({ email: dto.email })

		if (isSameUser && String(id) !== String(isSameUser._id))
			throw new NotFoundException('Email is busy!')

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}

		user.email = dto.email

		if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin

		return await user.save()
	}

	async getCount() {
		return await this.UserModel.find().countDocuments().exec()
	}

	async getAllUser(searchTerm?: string) {
		let options = {}
		if (searchTerm) {
			options = {
				$or: [{ email: new RegExp(searchTerm, 'i') }],
			}
		}

		return await this.UserModel.find(options)
			.select('-password -__v -updatedAt')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async deleteUser(id: string) {
		return await this.UserModel.findByIdAndDelete(id).exec()
	}

	async toggleFavorite(movieID: Types.ObjectId, user: User) {
		const { _id, favorites } = user

		return await this.UserModel.findByIdAndUpdate(
			_id,
			{
				favorites: favorites.includes(movieID)
					? favorites.filter((item) => String(item) !== String(movieID))
					: [...favorites, movieID],
			},
			{ new: true }
		)
	}

	async getFavorites(id: Types.ObjectId) {
		return await this.UserModel.findById(id, 'favorites')
			.populate('favorites')
			.exec()
			.then((data) => data.favorites)
	}
}
