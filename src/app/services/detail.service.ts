import { Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { ApiService } from '../utils/api-request';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
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

  getServices(): Promise<AxiosResponse<any>> {
    return this.apiService.getNoAuth(`/food/public/search`);
  }

  createPayment(cart: any): Promise<AxiosResponse<any>> {
    const payload = {
      amount: cart.totalPrice,
      currency: 'USD',
      description: `Payment for movie ticket: ${cart.title}`,
      cart: cart,
    };

    return this.apiService.postNoAuth('/payment/create', payload);
  }

  executePayment(
    paymentId: string,
    payerId: string
  ): Promise<AxiosResponse<any>> {
    const queryParams = `?paymentId=${paymentId}&PayerID=${payerId}`;
    return this.apiService.getNoAuth(`/payment/success${queryParams}`);
  }

  cancelPayment(): Promise<AxiosResponse<any>> {
    return this.apiService.getNoAuth('/payment/cancel');
  }
}
