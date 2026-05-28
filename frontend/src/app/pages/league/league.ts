import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-league',
  imports: [CommonModule],
  templateUrl: './league.html',
  styleUrl: './league.css',
})
export class League implements OnInit {
  table: any[] = [];
  leagueId: string | null = '';

  constructor(private api: Api, 
    private cd: ChangeDetectorRef, 
    private route: ActivatedRoute) {}

ngOnInit() {

  const leagues: any = {
    'premier-league': 'premier-league',
    'bundesliga': 'bundesliga',
    'la-liga': 'la-liga'
  };

  this.route.paramMap.subscribe(params => {

    const leagueId = params.get('leagueId');

    const apiLeague = leagues[leagueId || 'premier-league'];

    this.api.getTable(apiLeague).subscribe((data: any) => {

      this.table = data.response[0].league.standings[0];

      console.log('TABLE UPDATED:', this.table);
      this.cd.detectChanges();
    });

  });

}
}