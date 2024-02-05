import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'

export type RatingModel = HydratedDocument<Rating>

@Schema()
export class Rating extends Document {
	@Prop({ type: Types.ObjectId, ref: 'User' })
	userId: Types.ObjectId

	@Prop({ type: Types.ObjectId, ref: 'Movie' })
	movieId: Types.ObjectId

	@Prop()
	value: number
}
export const RatingSchema = SchemaFactory.createForClass(Rating)
