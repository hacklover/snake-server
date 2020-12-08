import {Controller, Post, Ip, Body, HttpException, HttpStatus, NotAcceptableException} from '@nestjs/common';
import {SnakeService} from '../snake/snake.service';
import {ControlsService} from './controls.service';
import {UtilsService} from '../utils/utils.service';
import {MovesService} from "../moves/moves.service";

@Controller()
export class ControlsController {
    constructor(
        private readonly snakeService: SnakeService,
        private readonly movesService: MovesService,
        private readonly controlsService: ControlsService,
    ) {}

    @Post('api/input')
    input(
        @Body('username') username: string,
        @Body('direction') direction: string,
        @Ip() ip: string,
    ): any {
        username = UtilsService.parseUsername(username);
        direction = direction.toLowerCase();

        // is direction given?
        if (!direction) {
            throw new NotAcceptableException('Direction is missing');
        }

        // is direction valid?
        if (!this.controlsService.isValidDirection(direction)) {
            throw new HttpException('Direction isn\'t valid', HttpStatus.NOT_ACCEPTABLE);
        }

        // prevent snake move in lazy mode
        if (this.snakeService.getSnakeMode() === 'lazy') {
            throw new HttpException('Snake is in lazy mode', HttpStatus.NOT_ACCEPTABLE);
        }

        // prevent snake opposite direction in next move
        if (this.movesService.getCountMovesInQueue() === 0 && this.controlsService.isOppositeDirection(direction) && !this.snakeService.isSnakeDamaged()) {
            throw new HttpException('Direction is the opposite of the current direction', HttpStatus.NOT_ACCEPTABLE);
        }

        // add snake direction to move queues
        this.movesService.addDirectionToMovesQueue(username, ip, direction);

        // process move now if is in anarchy mode
        if (this.movesService.getCountMovesInQueue() === 1) {
            this.movesService.handleNextMoveInQueue();
        }

        return { success: true };
    }
}
