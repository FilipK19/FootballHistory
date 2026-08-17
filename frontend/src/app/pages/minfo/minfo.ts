import { Component, computed, signal } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';

import { Player } from '../../assets/player/player';

@Component({
  selector: 'app-minfo',
  imports: [RouterModule, CommonModule, Player],
  templateUrl: './minfo.html',
  styleUrl: './minfo.css',
})
export class Minfo {
  seasonId: string = '';
  leagueId: string = '';
  matchId: string = '';
  minfo_data = signal<any[]>([]);

  constructor(
    private route: ActivatedRoute,
    private api: Api,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.seasonId = params.get('seasonId') || '24';
      this.leagueId = params.get('leagueId') || 'premier-league';
      this.matchId = params.get('matchId') || '';

      if (!this.leagueId || !this.seasonId || !this.matchId) return;

      this.api
        .getMatchInfo(this.leagueId, this.seasonId, parseInt(this.matchId))
        .subscribe((data: any) => {
          console.log(data);
          this.minfo_data.set(data.data.response);
        });
    });
  }

  // filters the statistics to only include the desired data and returns it an array
  displayedStats = computed(() => {
    const homeStats = this.minfo_data()?.[0]?.statistics?.[0]?.statistics ?? [];
    const awayStats = this.minfo_data()?.[0]?.statistics?.[1]?.statistics ?? [];

    // Selected statistics we want to display
    const wantedStats = [
      'Shots on Goal',
      'Blocked Shots',
      'Fouls',
      'Corner Kicks',
      'Offsides',
      'Ball Possession',
      'Goalkeeper Saves',
      'expected_goals',
    ];

    return wantedStats.map((statName) => ({
      home: homeStats.find((stat: any) => stat.type === statName),
      away: awayStats.find((stat: any) => stat.type === statName),
    }));
  });

  // Converts a value to a number, handling null, undefined, and percentage strings
  private toNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value.replace('%', '')) || 0;
    return 0;
  }

  // Calculates the percentage of statistics
  getPercent(value: any, other: any): number {
    const a = this.toNumber(value);
    const b = this.toNumber(other);

    const total = a + b;

    return total ? (a / total) * 100 : 25;
  }

  // Define the coordinates for each formation
  formationCoordinates: Record<string, { x: number; y: number }[]> = {
    '4-3-3': [
      { x: 50, y: 4 }, // GK

      { x: 10, y: 12 }, //RB
      { x: 35, y: 12 }, //CB
      { x: 65, y: 12 }, //CB
      { x: 90, y: 12 }, //LB

      { x: 30, y: 30 }, //CM
      { x: 50, y: 25 }, //CDM
      { x: 70, y: 30 }, //CM

      { x: 15, y: 42 }, //RW
      { x: 50, y: 44 }, //ST
      { x: 85, y: 42 }, //LW
    ],

    '4-2-3-1': [
      { x: 50, y: 4 }, // GK

      { x: 10, y: 12 }, //RB
      { x: 35, y: 12 }, //CB
      { x: 65, y: 12 }, //CB
      { x: 90, y: 12 }, //LB

      { x: 35, y: 25 }, //CDM
      { x: 65, y: 25 }, //CDM

      { x: 15, y: 35 }, //RM
      { x: 50, y: 35 }, //CAM
      { x: 85, y: 35 }, //LM

      { x: 50, y: 44 }, //ST
    ],

    '3-5-2': [
      { x: 50, y: 4 }, // GK

      { x: 25, y: 12 }, //CB
      { x: 50, y: 12 }, //CB
      { x: 75, y: 12 }, //CB

      { x: 90, y: 27 }, //LM
      { x: 35, y: 25 }, //CDM
      { x: 65, y: 25 }, //CDM
      { x: 50, y: 25 }, //CAM
      { x: 10, y: 27 }, //RM

      { x: 60, y: 44 }, //LM
      { x: 40, y: 44 }, //ST
    ],
  };

  // Returns the players with their respective coordinates based on the formation
  getPlayers(team: any, home = true) {
    let players;
    // 1. Use custom formation
    if (this.formationCoordinates[team.formation]) {
      const coords = this.formationCoordinates[team.formation];

      players = team.startXI.map((player: any, index: number) => ({
        ...player.player,

        x: coords[index].x,
        y: coords[index].y,
      }));
    }

    // 2. Use API grid
    else if (team.startXI[0]?.player?.grid) {
      players = this.generateFromGrid(team);
    }

    // 3. Last fallback
    else {
      //players = this.generateFormation(team.formation, team);
    }

    // finds player statistics form API using Id
    const teamPlayerStats =
      this.minfo_data()?.[0]?.players?.find((teamData: any) => teamData.team.id === team.team.id)
        ?.players ?? [];

    return players.map((p: any) => {
      const statsPlayer = teamPlayerStats.find((playerData: any) => playerData.player.id === p.id);

      const statistics = statsPlayer?.statistics?.[0];

      return {
        ...p,

        // Player statistics
        rating: statistics?.games?.rating ?? null,
        minutes: statistics?.games?.minutes ?? null,
        position: statistics?.games?.position ?? null,
        captain: statistics?.games?.captain ?? false,
        substitute: statistics?.games?.substitute ?? false,

        goals: statistics?.goals ?? null,
        shots: statistics?.shots ?? null,
        passes: statistics?.passes ?? null,
        tackles: statistics?.tackles ?? null,
        duels: statistics?.duels ?? null,
        dribbles: statistics?.dribbles ?? null,
        fouls: statistics?.fouls ?? null,
        cards: statistics?.cards ?? null,
        penalty: statistics?.penalty ?? null,

        x: home ? p.x : 100 - p.x,
        y: home ? p.y : 100 - p.y, // Invert the y and x coordinates for away team to keep display consistent

        side: home ? 'home' : 'away',

        kit: p.pos === 'G' ? team.team.colors.goalkeeper : team.team.colors.player
      };
    });
  }

  // Returns the players for the home team
  homePlayers = computed(() => {
    const lineup = this.minfo_data()?.[0]?.lineups?.[0];

    if (!lineup) return [];

    return this.getPlayers(lineup, true);
  });

  // Returns the players for the away team
  awayPlayers = computed(() => {
    const lineup = this.minfo_data()?.[0]?.lineups?.[1];

    if (!lineup) return [];

    return this.getPlayers(lineup, false);
  });

  // Generates player positions based on their grid values
  generateFromGrid(team: any) {
    return team.startXI
      .map((player: any) => {
        const grid = player.player.grid;

        if (!grid) {
          return null;
        }

        const [row, col] = grid.split(':').map(Number);

        // Number of players in this row
        const playersInRow = team.startXI.filter((p: any) =>
          p.player.grid?.startsWith(row + ':'),
        ).length;

        // Calculate x position based on the number of players in the row and their column
        const x = playersInRow === 1 ? 50 : ((playersInRow - col + 1) / (playersInRow + 1)) * 100;

        const yPositions: any = {
          1: 4, // GK
          2: 12, // Defence
          3: 25, // Midfield
          4: 35, // Attacking midfield
          5: 44, // Striker
        };

        return {
          ...player.player,

          x: x,

          y: yPositions[row] ?? row * 12,
        };
      })
      .filter(Boolean);
  }

  // STATISTICS active tab
  // Signal to track the active tab in the UI
  activeTab = signal('overview');

  // returns all statistics from the API
  displayedAllStats = computed(() => {
    const homeStats = this.minfo_data()?.[0]?.statistics?.[0]?.statistics ?? [];
    const awayStats = this.minfo_data()?.[0]?.statistics?.[1]?.statistics ?? [];

    return homeStats.map((homeStat: any) => ({
      home: homeStat,
      away: awayStats.find((awayStat: any) => awayStat.type === homeStat.type),
    }));
  });

  // PLAYER RATINGS active tab
  selectedPlayer = signal<any | null>(null);

  selectPlayer(player: any) {
    this.selectedPlayer.set(player);
  }
  closePlayerPopup() {
    this.selectedPlayer.set(null);
  }
}
