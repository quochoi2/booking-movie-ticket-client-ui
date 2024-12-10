import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieService } from '../../services/movie.service';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isModalOpen: boolean = false;
  videoUrl: string | null = null;
  movies: any = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private movieService: MovieService,
    public sanitizer: DomSanitizer,
    private detailService: DetailService
  ) {}

  mapMovieData(movie: any): any {
    return {
      id: movie.id,
      title: movie.title,
      image: movie.image,
      video: movie.video,
      isRelease: movie.isRelease,
      rating: movie.rating,
      showPlayButton: !!movie.video,
    };
  }

  ngOnInit(): void {
    this.fetchMovies();
    this.handlePaypalCallback();
  }

  // Gọi API để lấy danh sách phim
  fetchMovies(): void {
    this.loading = true;
    this.movieService
      .getAll()
      .then((response) => {
        const movies = response.data.data;
        this.movies = movies.map((movie: any) => this.mapMovieData(movie));
      })
      .catch((error) => {
        this.error = 'Failed to load movies. Please try again later.';
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  handlePaypalCallback(): void {
    const params = new URLSearchParams(window.location.search);
    console.log(window.location.search);

    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');

    console.log('Callback Params:', { paymentId, payerId });

    if (paymentId && payerId) {
      this.detailService
        .executePayment(paymentId, payerId)
        .then((response) => {
          console.log('Payment Execution Response:', response.data);
          alert('Payment successful!');
        })
        .catch((error) => {
          console.error('Payment execution error:', error);
          alert('Payment failed. Please contact support.');
        });
    }
  }

  // Tạo URL nhúng từ URL gốc
  createEmbedUrl(url: string): string {
    const videoId = this.extractVideoId(url); // Lấy videoId từ URL
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Tách videoId từ URL YouTube
  extractVideoId(url: string): string {
    let videoId = '';
    if (url.includes('youtu.be')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (match) videoId = match[1];
    } else if (url.includes('youtube.com')) {
      const match = url.match(
        /(?:youtube\.com\/(?:v|e(?:mbed)?)\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
      );
      if (match) videoId = match[1];
    }
    return videoId;
  }

  // Mở modal video
  openVideo(url: string): void {
    this.isModalOpen = true;
    this.videoUrl = this.createEmbedUrl(url);
    // console.log('Embed video URL:', this.videoUrl);
    document.body.classList.add('modal-open');
  }

  // Đóng modal video
  closeVideo(): void {
    this.isModalOpen = false;
    this.videoUrl = null;
    document.body.classList.remove('modal-open');
  }
}
