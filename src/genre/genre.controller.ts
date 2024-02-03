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
import { GenreService } from './genre.service'
import { Genre } from './genre.model'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateGenreDto } from './dto/createGenre.dto'

@Controller('genres')
export class GenreController {
	constructor(private readonly GenreService: GenreService) {}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return await this.GenreService.bySlug(slug)
	}

	@Get()
	async getGenres(@Query('searchTerm') searchTerm?: string): Promise<Genre[]> {
		return await this.GenreService.getAllGenre(searchTerm)
	}

	@Get('collections')
	async getCollections() {
		return await this.GenreService.getCollections()
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return await this.GenreService.byId(id)
	}

	@Post()
	@Auth('admin')
	@HttpCode(200)
	async createGenre() {
		return await this.GenreService.create()
	}

	@Put(':id')
	@Auth('admin')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async updateGenre(@Param('id') id: string, @Body() dto: CreateGenreDto) {
		return await this.GenreService.update(id, dto)
	}

	@Delete(':id')
	@Auth('admin')
	@HttpCode(200)
	async deleteGenre(@Param('id') id: string) {
		return await this.GenreService.delete(id)
	}
}
