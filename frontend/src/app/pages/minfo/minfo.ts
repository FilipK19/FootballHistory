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

  private toNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value.replace('%', '')) || 0;
  return 0;
}

getPercent(value: any, other: any): number {
    const a = this.toNumber(value);
    const b = this.toNumber(other);

    const total = a + b;

    return total ? (a / total) * 100 : 25;
}
}
