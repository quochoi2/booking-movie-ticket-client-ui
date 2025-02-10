import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-qr-payment-modal',
  templateUrl: './qr-payment-modal.component.html',
  styleUrls: ['./qr-payment-modal.component.scss'],
})
export class QrPaymentModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  // @Input() bankAccount: string = '';
  // @Input() bankName: string = '';
  // @Input() amount: number = 0;

  @Output() onClose = new EventEmitter<void>();

  cart: any;
  bankName: string = 'MBBank';
  bankAccount: string = '0867122003';
  amount: number = 0;
  paymentDescription: string = '';

  qrCodeUrl: string = '';
  countdown: number = 300;
  interval: any;
  checkPaymentTimeout: any;
  isCheckingPayment: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.getCartData();
    this.generateQR();
    this.startCountdown();
    this.startCheckingPayment();
  }

  getCartData() {
    this.cart = this.cartService.getCart(); // ✅ Lấy dữ liệu từ CartService

    if (!this.cart || !this.cart.totalPrice) {
      console.error('⚠️ Lỗi: Không có giỏ hàng!');
      this.closeModal();
      return;
    }
    this.amount = this.cart.totalPrice;
  }

  generateQR() {
    if (!this.cart) return;
    const transactionId = 'SE' + Math.floor(Math.random() * 1000000000);
    this.paymentDescription = transactionId;
    this.qrCodeUrl = `https://qr.sepay.vn/img?acc=${this.bankAccount}&bank=${this.bankName}&amount=2000&des=${this.paymentDescription}`;
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
    if (!this.cart) return;

    this.isCheckingPayment = true;
    clearInterval(this.checkPaymentTimeout);

    this.checkPaymentTimeout = setInterval(async () => {
      try {
        console.log('🔍 Đang kiểm tra thanh toán...');
        // console.log('📨 Gửi request checkPayment với data:', {
        //   cart: this.cart,
        //   reference: this.paymentDescription,
        // });
        const response = await this.paymentService.checkPayment(
          this.cart,
          this.paymentDescription
        );
        console.log('📩 API Response:', response.data);

        if (response.data.success) {
          alert('✅ Thanh toán thành công!');
          this.closeModal();
          this.router.navigate(['/']);
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
