import { Component, Output, EventEmitter } from '@angular/core';
import { Cart } from '../../../../../models/cart.model';
import { CartService } from '../../../../../services/cart.service';
import { DetailService } from '../../../../../services/detail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-childest',
  templateUrl: './modal-childest.component.html',
  styleUrl: './modal-childest.component.scss',
})
export class ModalChildestComponent {
  @Output() onClose = new EventEmitter<void>();
  selectedPaymentMethod: string | null = null;
  email: string = '';
  showEmailInput: boolean = false;

  onPaymentMethodChange() {
    this.showEmailInput =
      this.selectedPaymentMethod === 'credit_card' ||
      this.selectedPaymentMethod === 'paypal';
    if (!this.showEmailInput) {
      this.email = '';
    }
  }

  submitPayment() {
    const paymentInfo = {
      method: this.selectedPaymentMethod,
      email: this.showEmailInput ? this.email : null,
    };
    console.log('Payment Info:', paymentInfo);
    if (this.showEmailInput && this.email) {
      this.cartService.setEmail(this.email);
    }
    if (this.selectedPaymentMethod === 'paypal') {
      this.handlePaypalPayment();
    }
  }

  handlePaypalPayment(): void {
    this.cart.email = this.email; // Set user email into cart data
    this.detailService
      .createPayment(this.cart)
      .then((response) => {
        const approvalUrl = response.data.approvalUrl;
        if (approvalUrl) {
          window.location.href = approvalUrl; // Redirect user to PayPal
        }
      })
      .catch((error) => {
        console.error('Error creating PayPal payment:', error);
        alert('Failed to initiate PayPal payment.');
      });
  }

  cart: Cart = {
    // Khởi tạo giá trị mặc định cho cart
    title: '',
    showtime: '',
    date: '',
    cinema: '',
    seats: [],
    totalSeatPrice: 0,
    services: [],
    totalServicePrice: 0,
    totalPrice: 0,
    movieId: 0,
    showtimeId: 0,
    cinemaId: 0,
    email: '',
  };

  constructor(
    private cartService: CartService,
    private detailService: DetailService
  ) {}

  ngOnInit(): void {
    // Đăng ký lắng nghe sự thay đổi của cart
    this.cartService.cart$.subscribe((cart: Cart) => {
      this.cart = cart;
    });
  }

  close(): void {
    this.onClose.emit();
  }

  // check
  get seatList(): any {
    return this.cart.seats && this.cart.seats.length > 0
      ? this.cart.seats.map((seat) => seat.seatNumber).join(', ')
      : null;
  }
}
