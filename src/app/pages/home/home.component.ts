import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isModalOpen: boolean = false;
  video: SafeResourceUrl | null = null;
  isReleaseMovies: any[] = [];
  notReleaseMovies: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private movieService: MovieService
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
  }

  // Gọi API để lấy danh sách phim
  fetchMovies(): void {
    this.loading = true;
    this.movieService
      .getAll()
      .then((response) => {
        const movies = response.data.data;
        this.processReleaseMovies(movies);
        this.processNotReleaseMovies(movies);
      })
      .catch((error) => {
        this.error = 'Failed to load movies. Please try again later.';
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  processReleaseMovies(movies: any[]): void {
    this.isReleaseMovies = movies
      .filter((movie: any) => movie.isRelease === 0)
      .map((movie: any) => this.mapMovieData(movie));
  }

  processNotReleaseMovies(movies: any[]): void {
    this.notReleaseMovies = movies
      .filter((movie: any) => movie.isRelease === 1)
      .map((movie: any) => this.mapMovieData(movie));
  }

  openVideo(url: string): void {
    this.isModalOpen = true;
    const video = this.getVideoUrl(url);
    this.video = this.sanitizer.bypassSecurityTrustResourceUrl(video);
    document.body.classList.add('modal-open');
  }

  closeVideo(): void {
    this.isModalOpen = false;
    this.video = null;
    document.body.classList.remove('modal-open');
  }

  // Chuyển URL video thành dạng embed
  getVideoUrl(url: string): string {
    let videoId: string = '';
    if (url.includes('youtu.be')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (match) videoId = match[1];
    } else if (url.includes('youtube.com')) {
      const match = url.match(
        /(?:youtube\.com\/(?:v|e(?:mbed)?)\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
      );
      if (match) videoId = match[1];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
