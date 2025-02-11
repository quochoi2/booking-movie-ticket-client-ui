import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

// Định nghĩa giao diện Cart (Giỏ hàng)
interface Cart {
  title: string; // Tiêu đề phim
  showtime: string; // Giờ chiếu
  date: string; // Ngày chiếu
  cinema: string; // Rạp chiếu phim
  seats: { id: number; seatNumber: string; price: number }[]; // Danh sách ghế đã chọn
  totalSeatPrice: number; // Tổng giá của các ghế
  services: { name: string; price: number; quantity: number }[]; // Danh sách dịch vụ đã chọn
  totalServicePrice: number; // Tổng giá của các dịch vụ
  totalPrice: number; // Tổng giá của cả ghế và dịch vụ
  movieId: number; // ID phim
  showtimeId: number; // ID giờ chiếu
  cinemaId: number; // ID rạp chiếu
  email: string; // Email
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Khởi tạo cartSubject với giá trị mặc định ban đầu
  private cartSubject = new BehaviorSubject<Cart>({
    title: '', // Tiêu đề phim
    showtime: '', // Giờ chiếu
    date: '', // Ngày chiếu
    cinema: '', // Rạp chiếu phim
    seats: [], // Danh sách ghế đã chọn
    totalSeatPrice: 0, // Tổng giá ghế
    services: [], // Danh sách dịch vụ đã chọn
    totalServicePrice: 0, // Tổng giá dịch vụ
    totalPrice: 0, // Tổng giá của toàn bộ (ghế + dịch vụ)
    movieId: 0, // ID phim
    showtimeId: 0, // ID giờ chiếu
    cinemaId: 0, // ID rạp chiếu
    email: '', // Email
  });

  // Observable để lắng nghe thay đổi của cart
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadEmailFromStorage();
  }

  // Cập nhật thông tin phim vào giỏ hàng
  setMovieDetails(
    title: string,
    showtime: string,
    date: string,
    cinema: string,
    movieId: number,
    showtimeId: number,
    cinemaId: number
  ): void {
    const currentCart = this.cartSubject.value; // Lấy giá trị hiện tại của cart
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
    this.cartSubject.next(updatedCart); // Cập nhật giá trị mới vào cart
    // console.log('Thông tin phim đã được cập nhật:', updatedCart);
  }

  // Cập nhật thông tin phim vào giỏ hàng
  setEmail(email: string): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = {
      ...currentCart,
      email,
    };
    this.cartSubject.next(updatedCart);
    // console.log('Thông email đã được cập nhật:', updatedCart);
  }

  // Cập nhật thông tin ghế vào giỏ hàng và tính lại tổng giá tiền của ghế
  setSeats(seats: { id: number; seatNumber: string; price: number }[]): void {
    const currentCart = this.cartSubject.value; // Lấy giá trị hiện tại của cart
    const totalSeatPrice = seats.reduce((total, seat) => total + seat.price, 0); // Tính tổng giá của các ghế
    const updatedCart = { ...currentCart, seats, totalSeatPrice }; // Cập nhật thông tin ghế và tổng giá ghế
    updatedCart.totalPrice = this.calculateTotalPrice(updatedCart); // Tính lại tổng giá sau khi thêm ghế
    this.cartSubject.next(updatedCart); // Cập nhật cart với thông tin mới
    // console.log('Thông tin ghế đã được cập nhật:', updatedCart);
  }

  // Cập nhật thông tin dịch vụ vào giỏ hàng và tính lại tổng giá tiền của dịch vụ
  setServices(
    services: { name: string; price: number; quantity: number }[] // Dữ liệu dịch vụ
  ): void {
    const currentCart = this.cartSubject.value; // Lấy giá trị hiện tại của cart
    const totalServicePrice = services.reduce(
      (total, service) => total + service.price * service.quantity, // Tính tổng giá dịch vụ (số lượng * giá mỗi dịch vụ)
      0
    );
    const updatedCart = { ...currentCart, services, totalServicePrice }; // Cập nhật dịch vụ và tổng giá dịch vụ
    updatedCart.totalPrice = this.calculateTotalPrice(updatedCart); // Tính lại tổng giá sau khi thêm dịch vụ
    this.cartSubject.next(updatedCart); // Cập nhật cart với thông tin mới
    // console.log('Thông tin dịch vụ đã được cập nhật:', updatedCart);
  }

  // Tính tổng giá của cart (ghế + dịch vụ)
  private calculateTotalPrice(cart: Cart): number {
    return cart.totalSeatPrice + cart.totalServicePrice; // Tổng giá của ghế + dịch vụ
  }

  // Lấy thông tin cart hiện tại
  getCart(): Cart {
    return this.cartSubject.value; // Trả về giá trị cart hiện tại
  }

  loadEmailFromStorage(): void {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decode = jwtDecode<any>(accessToken);
        const email = decode.email;

        if (email) {
          const currentCart = this.cartSubject.value;
          const updatedCart = { ...currentCart, email };
          this.cartSubject.next(updatedCart);
          // console.log('Email đã được load và cập nhật vào cart:', updatedCart);
        }
      } catch (error) {
        console.error('Error decoding accessToken', error);
      }
    }
  }
}
