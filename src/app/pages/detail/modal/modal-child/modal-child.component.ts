import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-modal-child',
  templateUrl: './modal-child.component.html',
  styleUrl: './modal-child.component.scss',
})
export class ModalChildComponent {
  @Input() services: any[] = []; // Receive services data
  @Output() onClose = new EventEmitter<void>(); // Emit close event

  isModal = false;

  constructor(private cartService: CartService) {}

  close(): void {
    this.onClose.emit(); // Notify parent to close modal
  }

  increaseQuantity(service: any): void {
    service.quantity = (service.quantity || 0) + 1;
  }

  decreaseQuantity(service: any): void {
    if (service.quantity > 0) {
      service.quantity--;
    }
  }

  // Tính tổng giá trị
  getTotal(): number {
    return this.services.reduce(
      (total, service) => total + (service.quantity || 0) * service.price,
      0
    );
  }

  // Xử lý khi nhấn Submit
  submit(): void {
    const selectedServices = this.services
      .filter((service) => service.quantity > 0) // Lọc dịch vụ có quantity > 0
      .map((service) => ({
        name: service.name,
        price: service.price,
        quantity: service.quantity,
      }));

    // Cập nhật các dịch vụ vào CartService
    this.cartService.setServices(selectedServices);
    this.isModal = true;
  }

  closePaymentModal(): void {
    this.isModal = false;
  }
}
