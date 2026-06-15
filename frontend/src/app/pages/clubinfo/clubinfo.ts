import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-clubinfo',
  imports: [],
  templateUrl: './clubinfo.html',
  styleUrl: './clubinfo.css',
})
export class Clubinfo {

  clubId: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.clubId = params.get('clubId') || '';
    });
  }

}
