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

  // Cung cấp Observable để các component có thể subscribe và theo dõi thay đổi
  cart$ = this.cartSubject.asObservable();

  constructor() {}

  // Cập nhật thông tin phim vào cart
  setMovieDetails(
    title: string,
    showtime: string,
    date: string,
    cinema: string
  ): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = { ...currentCart, title, showtime, date, cinema };
    this.cartSubject.next(updatedCart);
  }

  // Cập nhật thông tin ghế vào cart
  setSeats(seats: string[]): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = { ...currentCart, seats };
    this.cartSubject.next(updatedCart);
  }

  // Cập nhật thông tin dịch vụ vào cart
  setServices(services: string[]): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = { ...currentCart, services };
    this.cartSubject.next(updatedCart);
  }

  // Cập nhật tổng tiền vào cart
  setTotalPrice(totalPrice: number): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = { ...currentCart, totalPrice };
    this.cartSubject.next(updatedCart);
  }

  // Lấy dữ liệu cart
  getCart(): Cart {
    return this.cartSubject.value;
  }
}
