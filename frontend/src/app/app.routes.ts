import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Temp } from './pages/temp/temp';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'temp', component: Temp}
];
