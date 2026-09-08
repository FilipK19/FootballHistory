import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api';

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
  allMinfoData = signal<Record<string, any[]>>({});

  constructor(private api: Api) {}

  scrollToInfo() {
    document.getElementById('info-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  ngOnInit() {
    this.api.getAllMinfo().subscribe((data: any) => {
      console.log(data);
      this.allMinfoData.set(data);
    });
  }
}
