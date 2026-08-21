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
  calendarData = signal<Record<string, any[]>>({});
  year = Number(this.seasonId);
  leagues = ['premier-league', 'bundesliga', 'serie-a', 'la-liga', 'ligue1'];

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

  // Group matches by date
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

  // Generate calendar months
  calendarMonths = computed(() => {
    const startYear = 2024;

    return Array.from({ length: 10 }, (_, index) => {
      const month = (7 + index) % 12;

      const year = index < 5 ? startYear : startYear + 1;

      const firstDate = new Date(year, month, 1);
      const lastDate = new Date(year, month + 1, 0);

      return {
        month,
        year,
        name: firstDate.toLocaleString('en', { month: 'long' }),
        daysInMonth: lastDate.getDate(),
        firstDay: (firstDate.getDay() + 6) % 7, // Adjusting to make Monday the first day of the week
      };
    });
  });

  // Get match count for a specific date and league
  getMatchCount(date: string, league: string): number {
    const matches = this.calendarData()[league];

    if (!matches) {
      return 0;
    }
    return matches.filter((match: any) => match.fixture.date.startsWith(date)).length;
  }

  // Format date as YYYY-MM-DD
  getDate(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}
