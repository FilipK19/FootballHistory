import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { signal } from '@angular/core';

@Component({
  selector: 'app-league',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './league.html',
  styleUrl: './league.css',
})
export class League implements OnInit {

  table = signal<any[]>([]);
  leagueId: string | null = '';
  seasonId: string | null = '';
  leagueName = signal<string>('');
  leagueSeason = signal<string>('');
  leagueLogo = signal<string>('');

  constructor(
    private api: Api,
    private route: ActivatedRoute
  ) {}

  // Connects to the Mock API to fetch League data
  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      this.leagueId = params.get('leagueId');
      this.seasonId = params.get('seasonId');

      if (!this.leagueId || !this.seasonId) return;

      this.api.getTable(this.leagueId, this.seasonId).subscribe((data: any) => {
        const league = data.data.response[0].league;

          this.leagueName.set(league.name);
          this.leagueSeason.set(league.season.toString());
          this.leagueLogo.set(league.logo);
          this.table.set(league.standings[0]);
      });

    });

  }
}