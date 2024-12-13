import { Injectable } from "@nestjs/common";
import { FormatMatchesData, poolMatchInterface, teamsInterface } from "../dtos/tournaments.dto";


@Injectable()
export class MatcheService {
    // if tournament created based on pool
    matchTeams: { poolId: string, teams: teamsInterface[] }[] = []

    public scheduleMatchesByPool(teams: teamsInterface[], pool: number): { poolIndex: string, teams: teamsInterface[] }[] {

        const matches = Array.from({ length: pool }, (_, index) => ({ poolIndex: `POOL-${index}`, teams: [] }))
        teams.forEach((team, index) => {
            const matchIndex = index % pool
            matches[matchIndex].teams.push(team)
        })
        return matches
    }
    public schedulePoolMatches(match: poolMatchInterface[]):FormatMatchesData[] {
        let poolScheduledMatches = []
        match.forEach((match) => {
            for (let i = 0; i < Math.floor((match.teams.length) / 2); i++) {
                poolScheduledMatches.push({
                    team1: match.teams[i * 2],
                    team2: match.teams[i * 2 + 1]
                })
            }
        })
        console.log('matches', poolScheduledMatches);
        return poolScheduledMatches
    }

    public scheduleMatchesBasedOnFormat(teams: teamsInterface[], format: string): any[] {
        if (!teams || teams.length === 0) {
            throw new Error("No teams provided");
        }

        switch (format.toLowerCase()) {
            case "single elimination":
                return this.scheduleSingleElimination(teams);

            case "double elimination":
                return this.scheduleDoubleElimination(teams);

            case "round robbin":
                return this.scheduleRoundRobin(teams);

            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    // Single Elimination
    private scheduleSingleElimination(teams: teamsInterface[]): any[] {
        const matches = [];
        const totalTeams = teams.length;
        const firstRoundMatches = Math.floor(totalTeams / 2);

        for (let i = 0; i < firstRoundMatches; i++) {
            matches.push({
                round: 1,
                match: `Match-1-${i + 1}`,
                team1: teams[i * 2],
                team2: teams[i * 2 + 1],
            });
        }

        // Handle odd number of teams with a bye
        if (totalTeams % 2 !== 0) {
            matches.push({
                round: 1,
                match: `Match-1-${firstRoundMatches + 1}`,
                team1: teams[teams.length - 1],
                team2: null // Automatic advancement
            });
        }

        return matches;
    }

    // Double Elimination
    private scheduleDoubleElimination(teams: teamsInterface[]): any[] {
        const matches: any[] = [];
        const upperBracket = this.scheduleSingleElimination(teams);
        const lowerBracket: any[] = [];
        const matchedTeams = new Set<string>();

        // Upper Bracket Matches
        matches.push(...upperBracket);

        // Lower Bracket Logic
        upperBracket.forEach((match, index) => {
            const losers = [
                { ...match.team1, originMatch: match.match },
                { ...match.team2, originMatch: match.match }
            ];

            // Filter out teams that have already been matched
            const unMatchedLosers = losers.filter(loser =>
                loser && !matchedTeams.has(loser.id)
            );

            // Create Lower Bracket Matches
            if (unMatchedLosers.length === 2) {
                const lowerMatch = {
                    team1: unMatchedLosers[0],
                    team2: unMatchedLosers[1]
                };

                // Add teams to matched set
                matchedTeams.add(unMatchedLosers[0].id);
                matchedTeams.add(unMatchedLosers[1].id);

                lowerBracket.push(lowerMatch);
            }
        });

        // Add lower bracket matches
        matches.push(...lowerBracket);

        return matches;
    }

    // Round Robin
    private scheduleRoundRobin(teams: teamsInterface[]): any[] {
        const matches = [];
        const teamCount = teams.length;

        // Generate a Round Robin schedule
        for (let round = 1; round < teamCount; round++) {
            for (let i = 0; i < teamCount / 2; i++) {
                const team1 = teams[i];
                const team2 = teams[teamCount - i - 1];
                matches.push({
                    round: round,
                    team1: team1,
                    team2: team2,
                });
            }

            // Rotate teams for the next round
            const lastTeam = teams.pop();
            teams.splice(1, 0, lastTeam!);
        }

        return matches;
    }


}

