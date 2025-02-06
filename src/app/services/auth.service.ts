import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { ApiService } from '../utils/api-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  register(
    fullName: string,
    email: string,
    username: string,
    password: string,
    role: string = 'user'
  ) {
    return this.apiService.postNoAuth<any>('/auth/register', {
      fullName,
      email,
      username,
      password,
      role,
    });
  }

  login(username: string, password: string) {
    return this.apiService.postNoAuth<any>('/auth/login', {
      username,
      password,
    });
  }
}
