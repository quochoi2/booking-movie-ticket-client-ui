import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  showSearch: boolean = false;
  movies: any[] = [];
  searchTerm: string = ''; // Store the search term
  searchSubject: Subject<string> = new Subject<string>();

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    // Subscribe to search term changes with debounce
    this.searchSubject
      .pipe(
        debounceTime(1000), // Delay to avoid rapid API calls
        distinctUntilChanged(), // Only call API if search term changes
        switchMap((searchTerm) => {
          this.searchTerm = searchTerm;
          return this.searchMovies(searchTerm); // Return the observable from the service
        })
      )
      .subscribe({
        next: (response: any) => {
          this.movies = response.data.data || []; // Assign the response data to movies
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
  }

  async toggleSearch(): Promise<void> {
    this.showSearch = !this.showSearch;
    console.log('Search Term on Toggle:', this.searchTerm);

    if (this.showSearch) {
      try {
        const response = await this.searchMovies(this.searchTerm);
        this.movies = response.data.data || [];
      } catch (err) {
        console.error('Error:', err);
      }
    }
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value;
    this.searchSubject.next(searchTerm); // Emit search term to Subject
  }

  // Function to fetch movies based on search term
  searchMovies(searchTerm: string) {
    if (searchTerm.trim() === '') {
      return this.movieService.getAll(); // Call API without search term to get all movies
    } else {
      return this.movieService.getAll(searchTerm); // Call API with search term
    }
  }

  loadTopRatedMovies(): void {
    this.movieService.getAll().then((response: any) => {
      this.movies = response.data;
    });
  }
}
