import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { ApiService } from '../utils/api-request';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  constructor(private apiService: ApiService) {}

  getAllMovieByIsRelease(
    isRelease: number,
    page: number = 1,
    pageSize: number = 6
  ): Promise<AxiosResponse<any>> {
    return this.apiService.getNoAuth(
      `/movie/public/by-release?isRelease=${isRelease}&page=${page}&limit=${pageSize}`
    );
  }
}
