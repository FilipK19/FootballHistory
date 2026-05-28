import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-league',
  imports: [CommonModule],
  templateUrl: './league.html',
  styleUrl: './league.css',
})
export class League {
  table: any[] = [];

  constructor(private api: Api, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getTable().subscribe((data: any) => {
      console.log(data);

      this.table = data.response[0].league.standings[0];

      this.cd.detectChanges();
    });
  }
}