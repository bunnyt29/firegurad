import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeVolunteer } from './become-volunteer';

describe('BecomeVolunteer', () => {
  let component: BecomeVolunteer;
  let fixture: ComponentFixture<BecomeVolunteer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeVolunteer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeVolunteer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
