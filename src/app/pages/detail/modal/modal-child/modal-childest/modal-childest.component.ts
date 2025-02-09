import { Component, Output, EventEmitter } from '@angular/core';
import { Cart } from '../../../../../models/cart.model';
import { CartService } from '../../../../../services/cart.service';
import { DetailService } from '../../../../../services/detail.service';

@Component({
  selector: 'app-modal-childest',
  templateUrl: './modal-childest.component.html',
  styleUrl: './modal-childest.component.scss',
})
export class ModalChildestComponent {
  @Output() onClose = new EventEmitter<void>();
  isLoginModalVisible: boolean = false;
  isQrModalVisible: boolean = false;
  selectedPaymentMethod: any;

  submitPayment(): void {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.isLoginModalVisible = true;
      return;
    }

    if (this.selectedPaymentMethod === 'paypal') {
      this.handlePaypalPayment();
    } else if (this.selectedPaymentMethod === 'bank_transfer') {
      this.handleBankTransfer();
    }
  }

  handlePaypalPayment(): void {
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

  // login
  closeLoginModal(): void {
    this.isLoginModalVisible = false;
  }

  // qr
  handleBankTransfer(): void {
    this.isQrModalVisible = true;
  }

  closeQrModal(): void {
    this.isQrModalVisible = false;
  }
}
