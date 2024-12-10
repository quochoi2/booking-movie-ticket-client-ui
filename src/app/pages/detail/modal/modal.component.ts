import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { DetailService } from '../../../services/detail.service';

@Component({
  selector: 'app-seat-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() seats: any[] = []; // Seat data passed as an input
  @Output() onClose = new EventEmitter<void>(); // Emit event to close modal

  selectedSeats: any[] = [];

  services: any[] = [];
  isModal: boolean = false; // To track if the new modal is open

  constructor(
    private cartService: CartService,
    private detailService: DetailService
  ) {}

  // submit
  confirmSelection(): void {
    this.detailService
      .getServices()
      .then((response) => {
        // console.log(response.data.data);
        this.services = response.data.data || [];
        this.isModal = true;
      })
      .catch((error) => console.error('Error fetching services:', error));
    this.cartService.setSeats(this.selectedSeats); // add infor of seats into cartservice
  }

  closeModalService(): void {
    this.isModal = false;
  }

  // seats
  selectSeat(seat: any): void {
    if (seat.isAvailable !== 0) {
      return;
    }

    if (this.selectedSeats.includes(seat)) {
      this.selectedSeats = this.selectedSeats.filter((s) => s !== seat);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  closeModal(): void {
    this.onClose.emit(); // Emit close event
  }

  getSelectedSeatNumbers(): string {
    return (
      this.selectedSeats.map((seat) => seat.seatNumber).join(', ') ||
      'Chưa chọn'
    );
  }

  getTotalPrice(): number {
    return this.selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }

  canConfirmSelection(): boolean {
    return this.selectedSeats.length > 0;
  }
}
