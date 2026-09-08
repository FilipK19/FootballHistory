import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import {KeyValuePipe} from '@angular/common';

import { Player } from '../../assets/player/player';

@Component({
  selector: 'app-season',
  imports: [RouterModule, Player, KeyValuePipe],
  templateUrl: './season.html',
  styleUrl: './season.css',
})

export class Season {
  playerColor = '#00008b';
  selectedSeason = signal(1);
  allMinfoData = signal<Record<string, Record<string, any[]>>>({});

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

  // Computes the key for the selected season based on the signal
  selectedSeasonKey = computed(() => {
    switch (this.selectedSeason()) {
      case 1: return 'season24';
      case 2: return 'season23';
      case 3: return 'season22';
      default: return 'season24';
    }
  });

  selectedSeasonData = computed(() =>
    this.allMinfoData()[this.selectedSeasonKey()] ?? {}
  );
}
