import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leagueinfo',
  imports: [RouterModule],
  templateUrl: './leagueinfo.html',
  styleUrl: './leagueinfo.css',
})
export class Leagueinfo {

  leagueId: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.leagueId = params.get('leagueId') || '';
    });
  }

}
