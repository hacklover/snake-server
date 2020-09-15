import { Controller, Post, Ip, Body, HttpException, HttpStatus } from '@nestjs/common';
import {UtilsService} from '../utils/utils.service';
import {DemocracyService} from './democracy.service';

@Controller()
export class DemocracyController {
    constructor( private readonly democracyService: DemocracyService ) {}

    @Post('api/vote')
    vote(
        @Body('vote') vote: string,
        @Body('username') username: string,
        @Ip() ip: string,
    ): any {
        if (!vote) {
            throw new HttpException('Vote is missing', HttpStatus.NOT_ACCEPTABLE);
        }

        vote = vote.toLowerCase();

        if (!DemocracyService.isValidVote(vote)) {
            throw new HttpException('Vote is invalid', HttpStatus.NOT_ACCEPTABLE);
        }

        username = UtilsService.parseUsername(username);

        this.democracyService.vote(vote, { username, ip });

        return { success: true };
    }
}
