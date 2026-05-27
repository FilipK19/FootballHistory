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
  message: string = '';

  constructor(private api: Api, private cd: ChangeDetectorRef) {}

ngOnInit() {
  this.api.getMessage().subscribe((data: any) => {
    this.message = data.message;
    this.cd.detectChanges();
  });
  }
}