import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Temp } from './pages/temp/temp';
import { Leagues } from './pages/leagues/leagues';
import { League } from './pages/league/league';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'temp', component: Temp},
    {path: 'leagues', component: Leagues},
    {path: 'league/:leagueId', component: League}
];
