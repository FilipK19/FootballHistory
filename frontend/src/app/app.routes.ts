import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Season } from './pages/season/season';
import { Leagues } from './pages/leagues/leagues';
import { League } from './pages/league/league';
import { Matches } from './pages/matches/matches';
import { Minfo } from './pages/minfo/minfo';
import { Calendar } from './pages/calendar/calendar';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'season', component: Season},
    {path: 'leagues/:seasonId', component: Leagues},
    {path: 'league/:leagueId/:seasonId', component: League},
    {path: 'league/:leagueId/:seasonId/matches', component: Matches},
    {path: 'league/:leagueId/:seasonId/matches/:matchId', component: Minfo},
    {path: 'calendar/:seasonId', component: Calendar}
];
