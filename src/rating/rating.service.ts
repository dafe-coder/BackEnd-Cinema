import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Rating } from './rating.model'
import { Model, Types } from 'mongoose'
import { MovieService } from 'src/movie/movie.service'
import { SetRatingDto } from './dto/set-rating.dto'

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(Rating.name) private readonly RatingModel: Model<Rating>,
		private readonly movieService: MovieService
	) {}

	async getRating(movieId: Types.ObjectId, userId: Types.ObjectId) {
		return await this.RatingModel.findOne({ movieId, userId })
			.select('value')
			.exec()
			.then((data) => (data ? data.value : 0))
	}

	async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
		const { movieId, value } = dto

		const newRating = await this.RatingModel.findOneAndUpdate(
			{ movieId, userId },
			{ userId, movieId, value },
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		).exec()

		const averageRating = await this.averageRatingByMovie(movieId)

		await this.movieService.updateRating(movieId, averageRating)
		return newRating
	}

	async averageRatingByMovie(movieId: Types.ObjectId) {
		const ratingMovie: Rating[] = await this.RatingModel.aggregate()
			.match({
				movieId: movieId,
			})
			.exec()

		return ratingMovie.length
			? ratingMovie.reduce((acc, item) => acc + item.value, 0) / ratingMovie.length
			: 0
	}
}
