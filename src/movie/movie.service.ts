import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Movie } from './movie.model'
import { Model, Types } from 'mongoose'
import { UpdateMovieDto } from './dto/updateMovie.dto'
import { GenresDto } from './dto/genres.dto'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(Movie.name) private readonly MovieModel: Model<Movie>
	) {}

	async getAllMovie(searchTerm?: string) {
		let options = {}
		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return await this.MovieModel.find(options)
			.select('-__v -updatedAt')
			.sort({ createdAt: 'descending' })
			.populate('actors genres')
			.exec()
	}

	async bySlug(slug: string): Promise<Movie> {
		const movie = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()

		if (!movie) {
			throw new NotFoundException('Movie not found')
		}
		return movie
	}

	async getMostPopular(): Promise<Movie[]> {
		const docs = await this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')

		return docs
	}

	async byActor(actorID: Types.ObjectId): Promise<Movie[]> {
		const movies = await this.MovieModel.find({ actors: actorID }).exec()
		if (!movies) {
			throw new NotFoundException('Movies not found')
		}
		return movies
	}

	async updateCountOpened(slug: string) {
		try {
			const movie = await this.MovieModel.findOneAndUpdate(
				{ slug },
				{
					$inc: { countOpened: 1 },
				},
				{ new: true }
			).exec()

			if (!movie) throw new NotFoundException('Not Found movie')
			return movie
		} catch (error) {
			throw new NotFoundException('Not Found movie')
		}
	}

	async byGenres({ genreIDs }: GenresDto): Promise<Movie[]> {
		const movies = await this.MovieModel.find({
			genres: { $in: genreIDs },
		}).exec()
		if (!movies) {
			throw new NotFoundException('Movies  not found')
		}
		return movies
	}

	/* Amin place */
	async byId(id: string): Promise<Movie> {
		const movie = await this.MovieModel.findById(id).populate('genres actors')
		if (!movie) {
			throw new NotFoundException('Movie not found')
		}
		return movie
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			poster: '',
			bigPoster: '',
			slug: '',
			actors: [],
			genres: [],
			title: '',
			videoUrl: '',
		}

		const movie = await this.MovieModel.create(defaultValue)

		await movie.save()
		return movie._id
	}

	async update(id: string, dto: UpdateMovieDto) {
		/* Todo: Telegram notification */

		try {
			const movie = await this.MovieModel.findByIdAndUpdate(id, dto, {
				new: true,
			}).exec()

			if (!movie) throw new NotFoundException('Not Found movie')

			return movie
		} catch (error) {
			throw new NotFoundException('Not Found movie')
		}
	}

	async delete(id: string) {
		try {
			return await this.MovieModel.findByIdAndDelete(id)
		} catch (error) {
			throw new NotFoundException('Not Found movie')
		}
	}
}
