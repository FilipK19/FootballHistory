import { Component, input } from '@angular/core';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {

  color = input('#ffffff');

  number = input<number | null>(null);

}
