import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { ApiService } from '../utils/api-request';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private apiService: ApiService) {}

  getAll(
    search: string = '',
    page: number = 1,
    pageSize: number = 8
  ): Promise<AxiosResponse<any>> {
    return this.apiService.getNoAuth(
      `/movie/public/search?search=${search}&page=${page}&pageSize=${pageSize}`
    );
  }

  getDetail(movieId: string): Promise<AxiosResponse<any>> {
    return this.apiService.getNoAuth(`/movie/public/${movieId}`);
  }
}
