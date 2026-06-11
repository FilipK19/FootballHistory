import { Component, signal } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  imports: [RouterModule, CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {

  seasonId: string = '';
  calendarData = signal<any[]>([]);

  constructor(private route: ActivatedRoute, private api: Api) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.seasonId = params.get('seasonId') || '2024';
    });
    
    this.api.getCalendarInfo(this.seasonId).subscribe((data: any) => {
      this.calendarData.set(Object.entries(data));
      });
  }
}
