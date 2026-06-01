import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Api {

  constructor(private http: HttpClient) {}

  // Function to get the league table for a specific league and season
  getTable(leagueId: string, seasonId: string) {
    return this.http.get(
      `http://127.0.0.1:8001/league/${leagueId}/${seasonId}`
    );
  }
}
