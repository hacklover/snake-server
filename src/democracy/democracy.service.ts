import {Injectable} from '@nestjs/common';
import {StatsLastActionService} from "../stats/stats-last-action.service";
import {MovesAutomaticService} from "../moves/moves-automatic/moves-automatic.service";

@Injectable()
export class DemocracyService {
    private mode: string;
    private democracyLevel: number = Number(process.env.DEMOCRACY_STARTING_LEVEL);
    private voters = [];

    constructor(
      private readonly statsLastActionService: StatsLastActionService,
      //private readonly movesAutomaticService: MovesAutomaticService,
    ) {}

    public applyDemocracyVotes() {
        const vote = this.checkPrevalentDemocracyVote();

        if (vote === 'anarchy' && this.democracyLevel > 1) {
            this.democracyLevel--;
        }
        if (vote === 'democracy' && this.democracyLevel < 99) {
            this.democracyLevel++;
        }

        if (this.isDemocracyLevelInDemocracyRange()) {
            this.setDemocracyMode('democracy')
        } else {
            this.setDemocracyMode('anarchy')
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
     * Set democracy mode
     */
    public setDemocracyMode(mode) {
        this.mode = mode

        switch(mode) {
            case 'anarchy':
                // todo probably it fixes something but it's a shitty fix
                // todo something have to be rewritten
                //this.movesAutomaticService.resetAutomaticMove();
                //this.movesService.processNextMoveInQueue();
            break;
        }
    }

    /**
     * Check if democracy level is active
     */
    public isDemocracyLevelInDemocracyRange() {
        return this.getDemocracyLevel() >= Number(process.env.DEMOCRACY_STARTS_AT);
    }

    /**
     * Check if democracy is active
     */
    public isDemocracyActive() {
        return this.mode === 'democracy'
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

