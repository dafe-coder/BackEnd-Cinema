import { Module } from '@nestjs/common'
import { GenreController } from './genre.controller'
import { GenreService } from './genre.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Genre, GenreSchema } from './genre.model'
import { MovieService } from 'src/movie/movie.service'
import { Movie, MovieSchema } from 'src/movie/movie.model'
import { TelegramService } from 'src/telegram/telegram.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
		MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
	],
	controllers: [GenreController],
	providers: [GenreService, MovieService, TelegramService],
})
export class GenreModule {}
