import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leagueinfo } from './leagueinfo';

describe('Leagueinfo', () => {
  let component: Leagueinfo;
  let fixture: ComponentFixture<Leagueinfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leagueinfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leagueinfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
