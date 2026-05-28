import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leagues',
  imports: [RouterModule],
  templateUrl: './leagues.html',
  styleUrl: './leagues.css',
})
export class Leagues {

  constructor(private router: Router) {}

  goToPlayer() {
  this.router.navigate(['/league', 'leagueId']);
}

}
