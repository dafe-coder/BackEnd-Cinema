import { Module } from '@nestjs/common'
import { ActorController } from './actor.controller'
import { ActorService } from './actor.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Actor, ActorSchema } from './actor.model'
import { Movie } from 'src/movie/movie.model'
@Module({
	imports: [
		MongooseModule.forFeature([{ name: Actor.name, schema: ActorSchema }]),
	],
	controllers: [ActorController],
	providers: [ActorService],
})
export class ActorModule {}
