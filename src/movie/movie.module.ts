import { Module } from '@nestjs/common'
import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Movie, MovieSchema } from './movie.model'
import { TelegramModule } from 'src/telegram/telegram.module'
import { TelegramService } from 'src/telegram/telegram.service'

@Module({
	imports: [
		TelegramModule,
		MongooseModule.forFeature([
			{
				name: Movie.name,
				schema: MovieSchema,
			},
		]),
	],
	controllers: [MovieController],
	providers: [MovieService, TelegramService],
	exports: [MovieService],
})
export class MovieModule {}
