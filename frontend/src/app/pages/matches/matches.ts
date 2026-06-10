import { Component, signal } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './matches.html',
  styleUrl: './matches.css',
})
export class Matches {

  seasonId: string = '';
  leagueId: string = '';
  mdata = signal<any[]>([]);

  constructor(private route: ActivatedRoute, private api: Api) {}

    ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.seasonId = params.get('seasonId') || '24';
      this.leagueId = params.get('leagueId') || 'premier-league';

      if (!this.leagueId || !this.seasonId) return;

      this.api.getMatches(this.leagueId, this.seasonId).subscribe((data: any) => {
        console.log(data);
        this.mdata.set(data.data.response);
      });

    });

  }
}
