import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clubinfo } from './clubinfo';

describe('Clubinfo', () => {
  let component: Clubinfo;
  let fixture: ComponentFixture<Clubinfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clubinfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clubinfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
