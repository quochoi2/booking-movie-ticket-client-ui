import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    title: '',
    showtime: '',
    date: '',
    cinema: '',
    seats: [],
    services: [],
    totalPrice: 0,
    movieId: 0,
    showtimeId: 0,
    cinemaId: 0,
  });

  cart$ = this.cartSubject.asObservable();

  constructor() {}

  // Cập nhật thông tin phim vào cart
  setMovieDetails(
    title: string,
    showtime: string,
    date: string,
    cinema: string,
    movieId: number,
    showtimeId: number,
    cinemaId: number
  ): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = {
      ...currentCart,
      title,
      showtime,
      date,
      cinema,
      movieId,
      showtimeId,
      cinemaId,
    };
    this.cartSubject.next(updatedCart);
    console.log('Cart updated:', updatedCart);
  }

  // Cập nhật thông tin ghế vào cart và tính lại tổng giá
  setSeats(seats: { seatNumber: string; price: number }[]): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = { ...currentCart, seats };
    updatedCart.totalPrice = this.calculateTotalPrice(updatedCart);
    this.cartSubject.next(updatedCart);
    console.log('Seats updated:', updatedCart);
  }

  // Cập nhật thông tin dịch vụ vào cart và tính lại tổng giá
  setServices(services: { name: string; price: number }[]): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = { ...currentCart, services };
    updatedCart.totalPrice = this.calculateTotalPrice(updatedCart);
    this.cartSubject.next(updatedCart);
    console.log('Services updated:', updatedCart);
  }

  // Tính tổng tiền dựa trên ghế và dịch vụ
  private calculateTotalPrice(cart: Cart): number {
    const seatsTotal = cart.seats.reduce(
      (total, seat) => total + seat.price,
      0
    );
    const servicesTotal = cart.services.reduce(
      (total, service) => total + service.price,
      0
    );
    return seatsTotal + servicesTotal;
  }

  // Lấy dữ liệu cart
  getCart(): Cart {
    return this.cartSubject.value;
  }
}
