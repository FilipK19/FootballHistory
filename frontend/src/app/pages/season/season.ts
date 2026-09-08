import { Component, signal } from '@angular/core';
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
  selectedSeason = signal(1);

  scrollToInfo() {
    document.getElementById('info-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
