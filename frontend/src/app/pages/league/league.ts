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

  constructor(
    private api: Api,
    private route: ActivatedRoute
  ) {}

  // Connects to the Mock API to fetch League data
  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      const leagueId = params.get('leagueId');
      const seasonId = params.get('seasonId');

      if (!leagueId || !seasonId) return;

      this.api.getTable(leagueId, seasonId).subscribe((data: any) => {
      this.table.set(data.response[0].league.standings[0]);
      });

    });

  }
}