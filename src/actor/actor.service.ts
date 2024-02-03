import { Injectable, NotFoundException } from '@nestjs/common'
import { Actor } from './actor.model'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ActorDto } from './actor.dto'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(Actor.name) private readonly ActorModel: Model<Actor>
	) {}

	async bySlug(slug: string): Promise<Actor> {
		const actor = await this.ActorModel.findOne({ slug })

		if (!actor) {
			throw new NotFoundException('Actor not found')
		}
		return actor
	}

	async getAllActor(searchTerm?: string) {
		let options = {}
		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'),
					},
					{
						slug: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}
		// Aggregation

		return await this.ActorModel.aggregate()
			.match(options)
			.addFields({
				convertedId: { $toString: '$_id' },
			})
			.lookup({
				from: 'movies',
				localField: 'convertedId',
				foreignField: 'actors',
				as: 'movies',
			})
			.addFields({
				countMovies: {
					$size: '$movies',
				},
			})
			.project({
				__v: 0,
				updatedAt: 0,
				movies: 0,
				convertedId: 0,
			})
			.sort({ createdAt: -1 })
			.exec()
	}

	/* Amin place */
	async byId(id: string): Promise<Actor> {
		const actor = await this.ActorModel.findById(id)
		if (!actor) {
			throw new NotFoundException('Actor not found')
		}
		return actor
	}

	async create() {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: '',
		}

		const actor = await this.ActorModel.create(defaultValue)
		await actor.save()
		return actor._id
	}

	async update(id: string, dto: ActorDto) {
		try {
			const actor = await this.ActorModel.findByIdAndUpdate(id, dto, {
				new: true,
			}).exec()
			return actor
		} catch (error) {
			throw new NotFoundException('Not Found actor')
		}
	}

	async delete(id: string) {
		try {
			return await this.ActorModel.findByIdAndDelete(id)
		} catch (error) {
			throw new NotFoundException('Not Found actor')
		}
	}
}
