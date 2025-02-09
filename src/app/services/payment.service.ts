import { Injectable } from '@angular/core';
import { ApiService } from '../utils/api-request';
import { AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private apiService: ApiService) {}

  // checkPayment(amount: number, reference: string): Promise<AxiosResponse<any>> {
  //   return this.apiService.getNoAuth(
  //     `/qrcode/check-payment?amount=${amount}&reference=${reference}`
  //   );
  // }

  checkPayment(cart: any, reference: string): Promise<AxiosResponse<any>> {
    const payload = {
      amount: 2000, // change later
      reference: reference,
      cart: cart,
    };

    return this.apiService.postNoAuth('/qrcode/check-payment', payload);
  }
}
