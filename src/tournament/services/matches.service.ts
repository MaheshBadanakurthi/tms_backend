import { Injectable } from "@nestjs/common";
import { teamsInterface } from "../dtos/tournaments.dto";


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
        const roundCount = Math.ceil(Math.log2(teams.length)); // Calculate the number of rounds
        let currentRoundTeams = [...teams];

        for (let round = 1; round <= roundCount; round++) {
            const roundMatches = [];
            for (let i = 0; i < currentRoundTeams.length; i += 2) {
                if (i + 1 < currentRoundTeams.length) {
                    roundMatches.push({
                        round: round,
                        match: `Match-${round}-${Math.floor(i / 2) + 1}`,
                        team1: currentRoundTeams[i],
                        team2: currentRoundTeams[i + 1],
                    });
                }
            }
            matches.push(...roundMatches);

            // Winners proceed to the next round (mock winners for now)
            currentRoundTeams = roundMatches.map((match) => ({
                players: [],
                id: `Winner-${match.match}`,
                sport: "N/A",
                teamName: `Winner of ${match.match}`,
            }));
        }

        return matches;
    }

    // Double Elimination
    private scheduleDoubleElimination(teams: teamsInterface[]): any[] {
        const upperBracket = this.scheduleSingleElimination(teams); // Upper bracket uses single elimination logic
        const lowerBracket = [];
        const matches = [...upperBracket];

        // Logic for Lower Bracket
        for (let round = 1; round < upperBracket.length; round++) {
            const losers = upperBracket
                .filter((match) => match.round === round)
                .map((match, index) => ({
                    players: [],
                    id: `Loser-${match.match}`,
                    sport: "N/A",
                    teamName: `Loser of Match-${round}-${index + 1}`,
                }));

            for (let i = 0; i < losers.length; i += 2) {
                if (i + 1 < losers.length) {
                    lowerBracket.push({
                        round: `Lower-${round}`,
                        match: `Lower-Match-${round}-${Math.floor(i / 2) + 1}`,
                        team1: losers[i],
                        team2: losers[i + 1],
                    });
                }
            }
        }

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
                    match: `Match-${round}-${i + 1}`,
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

