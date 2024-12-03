import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CinemaService } from '../../services/detail.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  movie: any = null;
  movieId: string = '';

  weekDays: { name: string; date: Date; isToday: boolean }[] = [];
  selectedDay: { name: string; date: Date; isToday: boolean } | null = null;
  cinemas: any[] = [];
  selectedCinema: any = '';

  showtimes: any[] = [];

  isModalOpen = false;
  seats: any[] = [];

  constructor(
    private cinemaService: CinemaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('movieId') || '';
    this.getMovieDetails(this.movieId);
    this.generateWeekDays();
    this.getCinemas();
  }

  // Lấy chi tiết phim
  getMovieDetails(movieId: string): void {
    this.cinemaService
      .getDetail(movieId)
      .then((response: any) => {
        this.movie = response.data.data;
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  }

  // Tạo danh sách ngày trong tuần
  generateWeekDays(): void {
    const today = new Date();
    this.weekDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(today.getDate() + index);
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date,
        isToday: index === 0,
      };
    });
    this.selectedDay = this.weekDays[0];
    this.fetchShowtimes(); // Fetch showtimes when the component is initialized
  }

  // Lấy danh sách rạp từ API
  getCinemas(): void {
    this.cinemaService
      .getAllCinemas()
      .then((response) => {
        this.cinemas = response.data.data;
      })
      .catch((error) => console.error('Error fetching cinemas:', error));
  }

  // Gọi API showtimes
  fetchShowtimes(): void {
    if (!this.movieId || !this.selectedDay) {
      return;
    }
    const date = this.selectedDay.date.toISOString().split('T')[0];
    const cinemaId = this.selectedCinema?.id || null;
    // console.log(this.movieId, '+', cinemaId, '+', date);

    this.cinemaService
      .getShowtimes(Number(this.movieId), cinemaId, date)
      .then((response) => {
        console.log(response.data.data);
        this.showtimes = response.data.data || [];
      })
      .catch((error) => console.error('Error fetching showtimes:', error));
  }

  // Chọn ngày
  selectDay(day: { name: string; date: Date; isToday: boolean }): void {
    this.selectedDay = day;
    this.fetchShowtimes();
  }

  // Chọn rạp
  selectCinema(cinema: any): void {
    this.selectedCinema = cinema;
    this.fetchShowtimes();
  }

  // Trả về URL Google Maps dựa trên địa chỉ rạp
  getGoogleMapsUrl(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  }

  // Fetch seat data when a showtime button is clicked
  openModal(cinemaId: number): void {
    this.cinemaService
      .getSeats(cinemaId)
      .then((response) => {
        this.seats = response.data.data;
        console.log(this.seats);
        this.isModalOpen = true;
      })
      .catch((error) => console.error('Error fetching seats:', error));
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  handleSeatSelection(selectedSeats: any[]): void {
    console.log('Selected seats:', selectedSeats);
    // Handle seat selection logic, e.g., save to the server or proceed to checkout
    this.closeModal();
  }
}
