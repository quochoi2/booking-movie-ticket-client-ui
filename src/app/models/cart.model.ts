export interface Cart {
  title: string;
  showtime: string;
  date: string;
  cinema: string;
  seats: { seatNumber: string; price: number }[];
  services: { name: string; price: number }[];
  totalPrice: number;
  movieId: number;
  showtimeId: number;
  cinemaId: number;
}
