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

  constructor(
    private api: Api,
    private route: ActivatedRoute
  ) {}

ngOnInit() {

  this.route.paramMap.subscribe(params => {

    const leagueId = params.get('leagueId');

    if (!leagueId) return;

    this.api.getTable(leagueId).subscribe((data: any) => {

      this.table.set(
        data.response[0].league.standings[0]
      );

    });

  });

}
}