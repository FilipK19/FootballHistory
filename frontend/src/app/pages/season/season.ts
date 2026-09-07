import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Player } from '../../assets/player/player';

@Component({
  selector: 'app-season',
  imports: [RouterModule, Player],
  templateUrl: './season.html',
  styleUrl: './season.css',
})
export class Season {
  playerColor = '#00008b';
}
