import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'

export type GenreModel = HydratedDocument<Genre>

@Schema()
export class Genre extends Document {
	@Prop()
	name: string

	@Prop({ unique: true })
	slug: string

	@Prop()
	description: string

	@Prop()
	icon: string
}

export const GenreSchema = SchemaFactory.createForClass(Genre)
