import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { MovieService } from './movie.service'
import { Movie } from './movie.model'
import { UpdateMovieDto } from './dto/updateMovie.dto'
import { Types } from 'mongoose'
import { IdValidationPipe } from 'src/pipes/idValidation.pipe'
import { GenresDto } from './dto/genres.dto'

@Controller('movies')
export class MovieController {
	constructor(private readonly MovieService: MovieService) {}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return await this.MovieService.bySlug(slug)
	}

	@Get()
	async getMovies(@Query('searchTerm') searchTerm?: string): Promise<Movie[]> {
		return await this.MovieService.getAllMovie(searchTerm)
	}

	@Get('most-popular')
	async getMostPopular(): Promise<Movie[]> {
		return await this.MovieService.getMostPopular()
	}

	@Put('count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return await this.MovieService.updateCountOpened(slug)
	}

	@Get('by-actor/:actorID')
	async getByActor(
		@Param('actorID', IdValidationPipe) actorID: Types.ObjectId
	): Promise<Movie[]> {
		return await this.MovieService.byActor(actorID)
	}

	@Post('by-genres')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async getByGenres(@Body() genreIDs: GenresDto): Promise<Movie[]> {
		return await this.MovieService.byGenres(genreIDs)
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return await this.MovieService.byId(id)
	}

	@Post()
	@Auth('admin')
	@HttpCode(200)
	async createMovie() {
		return await this.MovieService.create()
	}

	@Put(':id')
	@Auth('admin')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async updateMovie(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
		return await this.MovieService.update(id, dto)
	}

	@Delete(':id')
	@Auth('admin')
	@HttpCode(200)
	async deleteMovie(@Param('id') id: string) {
		return await this.MovieService.delete(id)
	}
}
