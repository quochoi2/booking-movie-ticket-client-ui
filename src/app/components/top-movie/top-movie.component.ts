import { Component, OnInit } from '@angular/core';
import { GenreService } from '../../services/genre.service';

@Component({
  selector: 'app-top-movie',
  templateUrl: './top-movie.component.html',
  styleUrl: './top-movie.component.scss',
})
export class TopMovieComponent implements OnInit {
  movies: any[] = [];
  currentFilter: string = 'day'; // Mặc định là 'day'
  currentMonth: number = new Date().getMonth() + 1; // Tháng hiện tại
  currentDay: number = new Date().getDate(); // Ngày hiện tại
  currentWeek: number = this.getWeekNumber(new Date()); // Tuần hiện tại
  currentYear: number = new Date().getFullYear(); // Năm hiện tại

  constructor(private genreService: GenreService) {}

  ngOnInit(): void {
    this.fetchMovies(this.currentFilter);
  }

  fetchMovies(filter: string): void {
    switch (filter) {
      case 'day':
        this.genreService
          .top5MovieByDay(this.currentMonth, this.currentDay)
          .then((res) => {
            // console.log(res.data);
            this.movies = res.data.movies;
          });
        break;

      case 'week':
        this.genreService.top5MovieByWeek(this.currentWeek).then((res) => {
          // console.log(res.data);
          this.movies = res.data.movies;
        });
        break;

      case 'month':
        this.genreService.top5MovieByMonth(this.currentMonth).then((res) => {
          // console.log(res.data);
          this.movies = res.data.movies;
        });
        break;

      case 'year':
        this.genreService.top5MovieByYear(this.currentYear).then((res) => {
          // console.log(res.data);
          this.movies = res.data.movies;
        });
        break;
    }
  }

  onFilterChange(filter: string): void {
    this.currentFilter = filter;
    this.fetchMovies(filter);
  }

  // Hàm để tính số tuần trong năm
  getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1); // Ngày đầu năm
    const days = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
    ); // Số ngày trôi qua từ đầu năm
    return Math.ceil((days + 1) / 7); // Chia cho 7 để có tuần
  }
}
