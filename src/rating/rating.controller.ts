import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { RatingService } from './rating.service'
import { User } from 'src/user/decorators/user.decorator'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { SetRatingDto } from './dto/set-rating.dto'
import { IdValidationPipe } from 'src/pipes/idValidation.pipe'

@Controller('ratings')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Get(':movieId')
	@Auth()
	async getRating(
		@Param('movieId') movieId: Types.ObjectId,
		@User('_id') id: Types.ObjectId
	) {
		return this.ratingService.getRating(movieId, id)
	}

	@Post('set-rating')
	@Auth()
	@UsePipes(new ValidationPipe())
	async createRating(
		@User('_id') id: Types.ObjectId,
		@Body() dto: SetRatingDto
	) {
		return this.ratingService.setRating(id, dto)
	}
}
