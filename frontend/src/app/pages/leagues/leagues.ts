import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leagues',
  imports: [RouterModule],
  templateUrl: './leagues.html',
  styleUrl: './leagues.css',
})
export class Leagues {

  seasonId: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.seasonId = params.get('seasonId') || '24';
    });
  }
}
