export interface Cart {
  title: string;
  showtime: string;
  date: string;
  cinema: string;
  seats: { seatNumber: string; price: number }[];
  totalSeatPrice: number;
  services: { name: string; price: number; quantity: number }[];
  totalServicePrice: number;
  totalPrice: number;
  movieId: number;
  showtimeId: number;
  cinemaId: number;
  email: string;
}
