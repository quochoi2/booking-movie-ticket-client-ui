import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailService } from '../../services/detail.service';
import { CartService } from '../../services/cart.service';
import { formatTime } from '../../utils/format-time';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  Math = Math;

  currentUserId!: number;
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

  comments: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 5;
  newComment: string = '';
  isLoading: boolean = false;

  newRating: number = 0;
  hoveredRating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  isLoggedIn: boolean = false;
  isLoginModalVisible: boolean = false;

  constructor(
    private detailService: DetailService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('movieId') || '';
    this.getMovieDetails(this.movieId);
    this.generateWeekDays();
    this.getCinemas();
    this.loadComments(this.currentPage);
    this.checkLoginStatus();
    this.currentUserId = this.userService.getUser().id || null;
  }

  loadComments(page: number = 1): void {
    this.isLoading = true;
    this.detailService
      .getAllComments(this.movieId, page, this.pageSize)
      .then((res) => {
        const data = res.data;
        this.comments = data.comments.map((comment: any) => ({
          ...comment,
          user: comment.user || { fullName: 'Anonymous' },
        }));
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      })
      .catch((err) => {
        console.error('Error loading comments:', err);
        this.isLoading = false;
      });
  }

  // Gửi bình luận mới
  submitComment(event: Event): void {
    event.preventDefault();

    if (!this.isLoggedIn) {
      this.openLoginModal();
      return;
    }

    if (!this.newComment.trim()) {
      alert('Please enter a comment.');
      return;
    }

    if (this.newRating < 1 || this.newRating > 5) {
      alert('Please provide a rating between 1 and 5.');
      return;
    }

    const commentData = {
      movieId: this.movieId,
      userId: this.userService.getUser().id,
      content: this.newComment.trim(),
      rating: this.newRating,
    };

    this.detailService
      .createComment(commentData)
      .then(() => {
        this.newComment = '';
        this.newRating = 0;
        this.loadComments(this.currentPage);
      })
      .catch((err) => {
        console.error('Error creating comment:', err);
      });
  }

  // Điều hướng giữa các trang
  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadComments(page);
      // console.log('Current Page:', this.currentPage);
    }
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
    console.log(this.cinemaId);

    this.detailService
      .getSeats(this.cinemaId)
      .then((response) => {
        this.seats = response.data.data;
        console.log('🪑 Seats Data:', this.seats);
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

  // login
  // Mở modal đăng nhập
  openLoginModal(): void {
    this.isLoginModalVisible = true;
  }

  // Đóng modal đăng nhập
  closeLoginModal(): void {
    this.isLoginModalVisible = false;
  }

  // Kiểm tra trạng thái đăng nhập
  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('accessToken');
  }

  // Gọi khi hover vào ngôi sao
  hoverStar(star: number): void {
    this.hoveredRating = star;
  }

  // Gọi khi mouseleave
  resetHover(): void {
    this.hoveredRating = 0;
  }

  // Gọi khi click vào ngôi sao
  setRating(star: number): void {
    this.newRating = star;
  }

  // delete button
  confirmDeleteComment(
    movieId: number,
    commentId: number,
    userId: number
  ): void {
    if (userId !== this.currentUserId) {
      Swal.fire('Lỗi!', 'Bạn không có quyền xóa bình luận này.', 'error');
      return;
    }

    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa bình luận này?',
      text: 'Bạn sẽ không thể khôi phục sau khi xóa!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteComment(movieId, commentId);
      }
    });
  }

  deleteComment(movieId: number, commentId: number): void {
    this.detailService
      .deleteComment(movieId, commentId)
      .then(() => {
        // Update UI after deletion
        this.comments = this.comments.filter((c) => c.id !== commentId);
        Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
      })
      .catch((error) => {
        console.error('Failed to delete comment', error);
        Swal.fire('Error', 'Could not delete the comment.', 'error');
      });
  }
}
