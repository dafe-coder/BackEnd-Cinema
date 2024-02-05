import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Genre } from './genre.model'
import { Model } from 'mongoose'
import { CreateGenreDto } from './dto/createGenre.dto'
import { MovieService } from 'src/movie/movie.service'
import { IResult } from './genre.interface'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(Genre.name) private readonly GenreModel: Model<Genre>,
		private readonly movieService: MovieService
	) {}

	async bySlug(slug: string): Promise<Genre> {
		const genre = await this.GenreModel.findOne({ slug })
		if (!genre) {
			throw new NotFoundException('Genre not found')
		}
		return genre
	}

	async getAllGenre(searchTerm?: string) {
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
					{
						description: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return await this.GenreModel.find(options)
			.select('-__v -updatedAt')
			.sort({ createdAt: 'descending' })
			.exec()
	}

	async getCollections() {
		const genres = await this.getAllGenre()

		const collections = await Promise.all(
			genres.map(async (genre) => {
				const movieByGenre = await this.movieService.byGenres({
					genreIDs: [genre._id],
				})

				const result: IResult = {
					_id: String(genre._id),
					image: movieByGenre[0].bigPoster,
					title: genre.name,
					slug: genre.slug,
				}

				return result
			})
		)
		return collections
	}

	/* Amin place */
	async byId(id: string): Promise<Genre> {
		const genre = await this.GenreModel.findById(id)
		if (!genre) {
			throw new NotFoundException('Genre not found')
		}
		return genre
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		}

		const genre = await this.GenreModel.create(defaultValue)
		await genre.save()
		return genre._id
	}

	async update(id: string, dto: CreateGenreDto) {
		try {
			const genre = await this.GenreModel.findByIdAndUpdate(id, dto, {
				new: true,
			}).exec()
			return genre
		} catch (error) {
			throw new NotFoundException('Not Found genre')
		}
	}

	async delete(id: string) {
		try {
			return await this.GenreModel.findByIdAndDelete(id)
		} catch (error) {
			throw new NotFoundException('Not Found genre')
		}
	}
}
