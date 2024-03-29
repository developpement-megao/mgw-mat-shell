import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgwMatShellComponent } from './mgw-mat-shell.component';

describe('MgwMatShellComponent', () => {
  let component: MgwMatShellComponent;
  let fixture: ComponentFixture<MgwMatShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MgwMatShellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MgwMatShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
