import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { Endpoint } from '../configs/endPoint';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private axiosNoAuthInstance: AxiosInstance;
  private axiosAuthInstance!: AxiosInstance;

  constructor() {
    this.axiosNoAuthInstance = axios.create({
      baseURL: Endpoint.API_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.updateAuthInstance();
  }

  /**
   * Update Axios Auth Instance headers with the latest token
   */
  private updateAuthInstance(): void {
    this.axiosAuthInstance = axios.create({
      baseURL: Endpoint.API_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  }

  /**
   * Renew token when it's expired
   */
  private async renewToken(): Promise<void> {
    try {
      const accessToken = localStorage.getItem('accessToken'); // Lấy access token từ localStorage
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const response = await this.axiosNoAuthInstance.post(
        '/auth/renew-token',
        { accessToken } // Gửi access token trong body
      );

      const newAccessToken = response.data.token.accessToken;

      // console.log('Token renewed successfully');

      localStorage.setItem('accessToken', newAccessToken); // Lưu access token mới vào localStorage
      this.updateAuthInstance(); // Cập nhật lại axios instance với token mới
    } catch (error: any) {
      console.error('Error renewing token:', error?.response?.data || error);
      throw error; // Rethrow error để xử lý ngoài
    }
  }

  /**
   * Handle request retries for authenticated methods
   */
  private async handleRequest<T>(
    method: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    try {
      return await method();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Token might be expired, try renewing it
        await this.renewToken();
        // Retry the request
        return await method();
      }
      throw error;
    }
  }

  // Authenticated GET method
  getAuth<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.handleRequest(() =>
      this.axiosAuthInstance.get(url, { params })
    );
  }

  // Non-authenticated GET method
  getNoAuth<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.axiosNoAuthInstance.get(url, { params });
  }

  // Authenticated POST method
  postAuth<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.handleRequest(() => this.axiosAuthInstance.post(url, data));
  }

  // Non-authenticated POST method
  postNoAuth<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.axiosNoAuthInstance.post(url, data);
  }

  // Authenticated PUT method
  putAuth<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.handleRequest(() => this.axiosAuthInstance.put(url, data));
  }

  // Non-authenticated PUT method
  putNoAuth<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.axiosNoAuthInstance.put(url, data);
  }

  // Authenticated DELETE method
  deleteAuth<T>(url: string): Promise<AxiosResponse<T>> {
    return this.handleRequest(() => this.axiosAuthInstance.delete(url));
  }

  // Non-authenticated DELETE method
  deleteNoAuth<T>(url: string): Promise<AxiosResponse<T>> {
    return this.axiosNoAuthInstance.delete(url);
  }
}
