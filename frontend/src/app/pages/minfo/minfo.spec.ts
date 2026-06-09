import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Minfo } from './minfo';

describe('Minfo', () => {
  let component: Minfo;
  let fixture: ComponentFixture<Minfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Minfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Minfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
