import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrPaymentModalComponent } from './qr-payment-modal.component';

describe('QrPaymentModalComponent', () => {
  let component: QrPaymentModalComponent;
  let fixture: ComponentFixture<QrPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrPaymentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
