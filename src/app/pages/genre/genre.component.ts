import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GenreService } from '../../services/genre.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss',
})
export class GenreComponent {
  movies: any[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;

  isModalOpen: boolean = false;
  videoUrl: string | null = null;

  constructor(
    private genreService: GenreService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchReleasedMovies();
  }

  fetchReleasedMovies(): void {
    const params = new URLSearchParams(window.location.search);
    let isRelease = params.get('isRelease');
    this.genreService
      .getAllMovieByIsRelease(
        Number(isRelease),
        this.currentPage,
        this.pageSize
      )
      .then((response: any) => {
        this.movies = response.data.movies;
        this.currentPage = response.data.pagination.currentPage;
        this.totalPages = response.data.pagination.totalPages;
      })
      .catch((error: any) => {
        console.error('Error fetching movies:', error);
      });
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchReleasedMovies();
    }
  }

  // openVideo(videoUrl: string): void {
  //   window.open(videoUrl, '_blank');
  // }

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
