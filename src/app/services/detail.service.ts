import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { ApiService } from '../utils/api-request';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  constructor(private apiService: ApiService) {}

  getDetail(movieId: string): Promise<AxiosResponse<any>> {
    return this.apiService.getNoAuth(`/movie/public/${movieId}`);
  }

  getAllCinemas(): Promise<AxiosResponse<any>> {
    return this.apiService.getNoAuth(`/cinema/public/search`);
  }

  getShowtimes(
    movieId: number,
    cinemaId: number | null,
    selectedDate: string
  ): Promise<AxiosResponse<any>> {
    let url = `/show-time/public/by-date?movieId=${movieId}&selectedDate=${selectedDate}`;
    if (cinemaId) {
      url += `&cinemaId=${cinemaId}`;
    }
    // console.log(url);
    return this.apiService.getNoAuth(url);
  }

  getSeats(cinemaId: number): Promise<AxiosResponse<any>> {
    return this.apiService.getNoAuth(`/seat/public/by-cinema/${cinemaId}`);
  }
}
