import { Component, computed, signal } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minfo',
  imports: [RouterModule, CommonModule],
  templateUrl: './minfo.html',
  styleUrl: './minfo.css',
})
export class Minfo {

  seasonId: string = '';
  leagueId: string = '';
  matchId: string = '';
  minfo_data = signal<any[]>([]);

  constructor(private route: ActivatedRoute, private api: Api) {}


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.seasonId = params.get('seasonId') || '24';
      this.leagueId = params.get('leagueId') || 'premier-league';
      this.matchId = params.get('matchId') || '';

      if (!this.leagueId || !this.seasonId || !this.matchId) return;

      this.api.getMatchInfo(this.leagueId, this.seasonId, parseInt(this.matchId)).subscribe((data: any) => {
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
    'expected_goals'
  ];

  return wantedStats.map(statName => ({
    home: homeStats.find((stat: any) => stat.type === statName),
    away: awayStats.find((stat: any) => stat.type === statName)
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
  formationCoordinates: Record<string, {x:number, y:number}[]> = {

    "4-3-3": [
      {x:50,y:4},   // GK

      {x:10,y:12},  //RB
      {x:35,y:12},  //CB
      {x:65,y:12},  //CB
      {x:90,y:12},  //LB

      {x:30,y:30},  //CM
      {x:50,y:25},  //CDM
      {x:70,y:30},  //CM

      {x:15,y:42},  //RW
      {x:50,y:45},  //ST
      {x:85,y:42}   //LW
    ],

      "4-2-3-1": [
      {x:50,y:4},   // GK

      {x:10,y:12},  //RB
      {x:35,y:12},  //CB
      {x:65,y:12},  //CB
      {x:90,y:12},  //LB

      {x:35,y:25},  //CDM
      {x:65,y:25},  //CDM
      
      {x:15,y:35},  //RM
      {x:50,y:35},  //CAM
      {x:85,y:35},  //LM

      {x:50,y:45},  //ST
    ],

      "3-5-2": [
      {x:50,y:4},   // GK

      {x:25,y:12},  //CB
      {x:50,y:12},  //CB
      {x:75,y:12},  //CB

      {x:90,y:27},  //LM
      {x:35,y:25},  //CDM
      {x:65,y:25},  //CDM
      {x:50,y:25},  //CAM
      {x:10,y:27},  //RM

      {x:60,y:45},  //LM
      {x:40,y:45},  //ST
    ]
  };

  // Returns the players with their respective coordinates based on the formation
  getPlayers(team: any, home = true) {

    const coords =
        this.formationCoordinates[team.formation] ??
        this.formationCoordinates["4-3-3"];

    return team.startXI.map((player: any, index: number) => {

        const c = coords[index];

        return {

            ...player.player,

            x: home ? c.x : 100 - c.x,
            y: home ? c.y : 100 - c.y,  // Invert the y and x coordinates for away team to keep display consistent
            side: home ? 'home' : 'away'
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
}
