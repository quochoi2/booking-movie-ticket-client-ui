import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChildestComponent } from './modal-childest.component';

describe('ModalChildestComponent', () => {
  let component: ModalChildestComponent;
  let fixture: ComponentFixture<ModalChildestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalChildestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChildestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
