import { Component, signal } from '@angular/core';
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

  constructor(private route: ActivatedRoute, private api: Api) {}


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.seasonId = params.get('seasonId') || '24';
      this.leagueId = params.get('leagueId') || 'premier-league';
      this.matchId = params.get('matchId') || '';

      if (!this.leagueId || !this.seasonId || !this.matchId) return;
    });
  }
}
