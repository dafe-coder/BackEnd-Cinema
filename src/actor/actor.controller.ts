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
import { ActorService } from './actor.service'
import { ActorDto } from './actor.dto'
import { Actor } from './actor.model'

@Controller('actors')
export class ActorController {
	constructor(private readonly ActorService: ActorService) {}
	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return await this.ActorService.bySlug(slug)
	}

	@Get()
	async getActors(@Query('searchTerm') searchTerm?: string): Promise<Actor[]> {
		return await this.ActorService.getAllActor(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return await this.ActorService.byId(id)
	}

	@Post()
	@Auth('admin')
	@HttpCode(200)
	async createActor() {
		return await this.ActorService.create()
	}

	@Put(':id')
	@Auth('admin')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async updateActor(@Param('id') id: string, @Body() dto: ActorDto) {
		return await this.ActorService.update(id, dto)
	}

	@Delete(':id')
	@Auth('admin')
	@HttpCode(200)
	async deleteActor(@Param('id') id: string) {
		return await this.ActorService.delete(id)
	}
}
