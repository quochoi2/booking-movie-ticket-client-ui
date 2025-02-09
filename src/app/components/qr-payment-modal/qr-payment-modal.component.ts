import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-payment-modal',
  templateUrl: './qr-payment-modal.component.html',
  styleUrls: ['./qr-payment-modal.component.scss'],
})
export class QrPaymentModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() bankAccount: string = '';
  @Input() bankName: string = '';
  @Input() amount: number = 0;
  @Input() paymentDescription: string = '';

  @Output() onClose = new EventEmitter<void>();

  qrCodeUrl: string = '';
  countdown: number = 300;
  interval: any;
  checkPaymentTimeout: any;
  isCheckingPayment: boolean = false;

  constructor(private paymentService: PaymentService, private router: Router) {}

  ngOnInit() {
    this.generateQR();
    this.startCountdown();
    this.startCheckingPayment();
  }

  generateQR() {
    this.qrCodeUrl = `https://qr.sepay.vn/img?acc=${this.bankAccount}&bank=${this.bankName}&amount=${this.amount}&des=${this.paymentDescription}`;
  }

  startCountdown() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.interval);
        this.closeModal();
        alert('⏳ Hết thời gian thanh toán!');
      }
    }, 1000);
  }

  /**
   * Liên tục kiểm tra thanh toán mỗi 5 giây
   */
  startCheckingPayment() {
    this.isCheckingPayment = true;
    this.checkPaymentTimeout = setInterval(async () => {
      try {
        console.log('🔍 Đang kiểm tra thanh toán...');
        const response = await this.paymentService.checkPayment(
          this.amount,
          this.paymentDescription
        );

        if (response.data.success) {
          alert('✅ Thanh toán thành công!');
          this.closeModal();
          this.router.navigate(['/']); // Điều hướng về trang chủ
        }
      } catch (error) {
        console.error('⚠️ Lỗi khi kiểm tra thanh toán:', error);
      }
    }, 5000);
  }

  closeModal() {
    this.onClose.emit();
    clearInterval(this.interval);
    clearInterval(this.checkPaymentTimeout);
    this.isCheckingPayment = false;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    clearInterval(this.checkPaymentTimeout);
  }
}
