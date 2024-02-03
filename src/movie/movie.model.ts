import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'
import { Ref } from '@typegoose/typegoose'
import { Actor } from 'src/actor/actor.model'
import { Genre } from 'src/genre/genre.model'

export type UserModel = HydratedDocument<Movie>

@Schema()
class Parameters extends Document {
	@Prop()
	year: number

	@Prop()
	duration: number

	@Prop()
	country: string
}

@Schema()
export class Movie extends Document {
	@Prop()
	poster: string

	@Prop()
	bigPoster: string

	@Prop()
	title: string

	@Prop({ unique: true })
	slug: string

	@Prop({ default: 4.0 })
	rating?: number

	@Prop({ default: 0 })
	countOpened?: number

	@Prop()
	parameters?: Parameters

	@Prop()
	videoUrl: string

	@Prop({ ref: () => Genre })
	genres: Ref<Genre>[]

	@Prop({ ref: () => Actor })
	actors: Ref<Actor>[]

	@Prop({ default: false })
	isSendTelegram?: boolean
}

export const MovieSchema = SchemaFactory.createForClass(Movie)
