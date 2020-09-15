import {Controller, Post, Ip, Body, HttpException, HttpStatus, NotAcceptableException} from '@nestjs/common';
import {SnakeService} from '../snake/snake.service';
import {ControlsService} from './controls.service';
import {UtilsService} from '../utils/utils.service';
import {DemocracyService} from '../democracy/democracy.service';
import {MovesService} from "../moves/moves.service";

@Controller()
export class ControlsController {
    constructor(
        private readonly snakeService: SnakeService,
        private readonly democracyService: DemocracyService,
        private readonly movesService: MovesService,
        private readonly controlsService: ControlsService,
    ) {}

    @Post('api/input')
    input(
        @Body('username') username: string,
        @Body('direction') direction: string,
        @Ip() ip: string,
    ): any {
        if (!direction) {
            throw new NotAcceptableException('Direction is missing');
        }

        username = UtilsService.parseUsername(username);
        direction = direction.toLowerCase();

        if (!this.controlsService.isValidDirection(direction)) {
            throw new HttpException('Direction isn\'t valid', HttpStatus.NOT_ACCEPTABLE);
        }

        // prevent opposite direction in next move
        if (this.movesService.getCountMovesInQueue() === 0 && this.controlsService.isOppositeDirection(direction) && !this.snakeService.isDamaged()) {
            throw new HttpException('Direction is the opposite of the current direction', HttpStatus.NOT_ACCEPTABLE);
        }

        // add direction to move queues, as alwaus
        this.movesService.addDirectionToMovesQueue(username, ip, direction);

        // with anarchy mode, process move now if movesInQueue === 1
        if (!this.democracyService.isDemocracyLevelInDemocracyRange() && this.movesService.getCountMovesInQueue() === 1) {
            this.movesService.processNextMoveInQueue();
        }

        return { success: true };
    }
}
