import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { ApiService } from '../utils/api-request';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private apiService: ApiService) {}

  getAllMovies(): Promise<AxiosResponse<any>> {
    return this.apiService.getNoAuth(`/movie/public/home`);
  }
}
