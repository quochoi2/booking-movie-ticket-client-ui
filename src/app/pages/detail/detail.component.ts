import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailService } from '../../services/detail.service';
import { CartService } from '../../services/cart.service';
import { formatTime } from '../../utils/format-time';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  movie: any = null;
  movieId: any = '';

  weekDays: { name: string; date: Date; isToday: boolean }[] = [];
  selectedDay: { name: string; date: Date; isToday: boolean } | null = null;
  cinemas: any[] = [];
  selectedCinema: any = null;

  showtimes: any[] = [];

  isModalOpen = false;
  seats: any[] = [];

  movieTitle: string = '';
  showtime: string = '';
  date: string = '';
  cinemaName: string = '';
  showtimeId: number = 0;
  cinemaId: number = 0;

  description: string = '';
  isTruncated: boolean = true;
  truncatedDescription: string = '';
  buttonText: string = '[Read more]';

  constructor(
    private detailService: DetailService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('movieId') || '';
    this.getMovieDetails(this.movieId);
    this.generateWeekDays();
    this.getCinemas();
  }

  // Hàm để cắt hoặc hiển thị toàn bộ nội dung
  setTruncatedDescription(): void {
    if (this.description.length > 200) {
      this.truncatedDescription = this.description.substring(0, 365) + '...';
      this.isTruncated = true;
      this.buttonText = '[Read more]';
    } else {
      this.truncatedDescription = this.description;
      this.isTruncated = false;
      this.buttonText = '';
    }
  }

  // Hàm để thay đổi trạng thái khi nhấp nút
  toggleReadMore(): void {
    this.isTruncated = !this.isTruncated;
    if (this.isTruncated) {
      this.truncatedDescription = this.description.substring(0, 365) + '...';
      this.buttonText = '[Read more]';
    } else {
      this.truncatedDescription = this.description;
      this.buttonText = '[Read less]';
    }
  }

  // Lấy chi tiết phim
  getMovieDetails(movieId: string): void {
    this.detailService
      .getDetail(movieId)
      .then((response: any) => {
        this.movie = response.data.data;
        // Once movie details are fetched, set the description
        this.description = this.movie?.description || '';
        this.setTruncatedDescription();
      })
      .catch((err) => console.error('Error fetching movie detail:', err));
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
    this.detailService
      .getAllCinemas()
      .then((response) => {
        this.cinemas = response.data.data;
      })
      .catch((err) => console.error('Error fetching cinemas:', err));
  }

  // Gọi API showtimes
  fetchShowtimes(): void {
    if (!this.movieId || !this.selectedDay) {
      return;
    }
    const date = this.selectedDay.date.toISOString().split('T')[0];
    const cinemaId = this.selectedCinema?.id || null;
    // console.log(this.movieId, '+', cinemaId, '+', date);

    this.detailService
      .getShowtimes(Number(this.movieId), cinemaId, date)
      .then((response) => {
        // console.log(response.data.data);
        this.showtimes = response.data.data || [];
      })
      .catch((error) => console.error('Error fetching showtimes:', error));
  }

  selectDay(day: { name: string; date: Date; isToday: boolean }): void {
    this.selectedDay = day;
    this.fetchShowtimes();
  }

  selectCinema(cinema: any | null): void {
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
  openModal(showtime: any): void {
    this.movieTitle = showtime?.movie.title || '';
    this.showtime = `${formatTime(showtime.timeStart)} ~ ${formatTime(
      showtime.timeEnd
    )}`;
    this.date = this.selectedDay?.date.toLocaleDateString('en-GB') || '';
    this.cinemaName = showtime.cinema?.name || '';
    this.showtimeId = showtime.id;
    this.cinemaId = showtime.cinema?.id || 0;

    this.detailService
      .getSeats(this.cinemaId)
      .then((response) => {
        this.seats = response.data.data;
        console.log(this.seats);
        this.isModalOpen = true;
      })
      .catch((error) => console.error('Error fetching seats:', error));

    // Cập nhật CartService với thông tin phim và showtime
    this.cartService.setMovieDetails(
      this.movieTitle,
      this.showtime,
      this.date,
      this.cinemaName,
      Number(this.movieId),
      Number(this.showtimeId),
      Number(this.cinemaId)
    );
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  handleSeatSelection(): void {
    // console.log('Selected seats:', selectedSeats);
    this.closeModal();
  }
}
