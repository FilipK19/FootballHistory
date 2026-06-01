import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Season } from './pages/season/season';
import { Leagues } from './pages/leagues/leagues';
import { League } from './pages/league/league';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'season', component: Season},
    {path: 'leagues/:seasonId', component: Leagues},
    {path: 'league/:leagueId/:seasonId', component: League}
];
