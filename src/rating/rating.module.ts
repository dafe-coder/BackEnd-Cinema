import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Rating, RatingSchema } from './rating.model'
import { RatingController } from './rating.controller'
import { RatingService } from './rating.service'
import { MovieService } from 'src/movie/movie.service'
import { Movie, MovieSchema } from 'src/movie/movie.model'
import { TelegramService } from 'src/telegram/telegram.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
		MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
	],
	controllers: [RatingController],
	providers: [RatingService, MovieService, TelegramService],
	exports: [RatingService],
})
export class RatingModule {}
