import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { ApiService } from '../utils/api-request';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private apiService: ApiService) {}

  googleCallback(code: string): Promise<AxiosResponse<any>> {
    const params = { code };
    // console.log(params);
    return this.apiService.getNoAuth(`/provide/google/callback/`, { params });
  }
}
