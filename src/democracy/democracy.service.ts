import 'dotenv/config';
import {Injectable} from '@nestjs/common';
import {ControlsService} from '../controls/controls.service';
import {StatsService} from "../stats/stats.service";
import {StatsLastActionService} from "../stats/statsLastAction.service";

@Injectable()
export class DemocracyService {
    private democracyLevel: number = Number(process.env.DEMOCRACY_STARTING_LEVEL);
    private voters = [];

    constructor(
      private readonly controlsService: ControlsService,
      private readonly statsService: StatsService,
      private readonly statsLastActionService: StatsLastActionService,
    ) {

    }

    public applyDemocracyVotes() {
        const vote = this.checkPrevalentDemocracyVote();

        if (vote === 'anarchy' && this.democracyLevel > 1) {
            this.democracyLevel--;
        }
        if (vote === 'democracy' && this.democracyLevel < 99) {
            this.democracyLevel++;
        }

        // clear votes
        this.voters = [];
    }

    /**
     * Check prevalent vote
     */
    private checkPrevalentDemocracyVote() {
        let votesAnarchy = 0;
        let votesDemocracy = 0;

        // for each voter
        Object.keys(this.voters).forEach(voter => {
            const vote = this.voters[voter];

            switch (vote) {
                case 'anarchy':
                    votesAnarchy++;
                    break;
                case 'democracy':
                    votesDemocracy++;
                    break;
            }
        });

        // return prevalent vote
        if (votesAnarchy > 0 || votesDemocracy > 0) {
            if (votesDemocracy > votesAnarchy) {
                return 'democracy';
            }

            return 'anarchy';
        }

        return null;
    }

    /**
     * Vote for anarchy or democracy mode
     *
     * @param vote
     * @param user
     */
    public vote(vote, user) {
        if (!this.voters[user.ip]) {
            this.voters[user.ip] = vote;

            this.statsLastActionService.addToLastActions({
                username: user.username,
                vote,
            });
        }
    }

    /**
     * Has user already voted?
     *
     * @param user
     */
    public hasAlreadyVoted(user) {
        if (this.voters[user.ip]) {
            return true;
        }

        return false
    }

    /**
     * Get democracy level
     */
    public getDemocracyLevel() {
        return this.democracyLevel;
    }

    /**
     * Set democracy level
     */
    public setDemocracyLevel(value) {
        this.democracyLevel = parseInt(value, 0);
    }

    /**
     * Check if democracy is active
     */
    public isDemocracyActive() {
        return this.getDemocracyLevel() >= Number(process.env.DEMOCRACY_STARTS_AT);
    }

    /**
     * Check if vote is valid
     *
     * @param vote
     */
    static isValidVote(vote: string) {
        return ['democracy', 'anarchy'].includes(vote)
    }
}
