import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-seat-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() seats: any[] = []; // Seat data passed as an input
  @Output() onClose = new EventEmitter<void>(); // Emit event to close modal
  @Output() onConfirm = new EventEmitter<any[]>(); // Emit selected seats on confirm

  selectedSeats: any[] = []; // Track selected seats

  // Handle seat selection
  selectSeat(seat: any): void {
    if (seat.isAvailable !== 0) {
      return; // Do nothing if seat is not available
    }

    // Toggle seat selection
    if (this.selectedSeats.includes(seat)) {
      this.selectedSeats = this.selectedSeats.filter((s) => s !== seat);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  // Confirm seat selection
  confirmSelection(): void {
    this.onConfirm.emit(this.selectedSeats); // Emit selected seats
    this.closeModal();
  }

  // Close the modal
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
