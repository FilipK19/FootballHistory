import { Component, signal, computed } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private api: Api,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.seasonId = params.get('seasonId') || '2024';
    });

    this.api.getCalendarInfo(this.seasonId).subscribe((data: any) => {
      console.log(data);
      this.calendarData.set(data);
    });
  }

  groupedMatches = computed(() => {
    const groups: Record<string, any[]> = {};

    for (const matches of Object.values(this.calendarData())) {
      for (const match of matches) {
        const date = match.fixture.date.split('T')[0];

        if (!groups[date]) {
          groups[date] = [];
        }

        groups[date].push(match);
      }
    }

    return Object.entries(groups);
  });

  calendarMonths = computed(() => {
  const year = Number(this.seasonId);

  return Array.from({ length: 12 }, (_, month) => {
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);

    return {
      month,
      name: firstDate.toLocaleString('en', { month: 'long' }),
      daysInMonth: lastDate.getDate(),
      firstDay: (firstDate.getDay() + 6) % 7 // Adjusting to make Monday the first day of the week
    };
  });
});
}
