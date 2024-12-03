import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Endpoint } from '../configs/endPoint';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private axiosAuthInstance: AxiosInstance;
  private axiosNoAuthInstance: AxiosInstance;

  constructor() {
    this.axiosAuthInstance = axios.create({
      baseURL: Endpoint.API_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosAuthInstance.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        } else {
          console.warn('No token found for authentication!');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosNoAuthInstance = axios.create({
      baseURL: Endpoint.API_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Phương thức GET dành cho API cần xác thực
  getAuth<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.axiosAuthInstance.get(url, { params });
  }

  // Phương thức GET dành cho API không cần xác thực
  getNoAuth<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.axiosNoAuthInstance.get(url, { params });
  }

  // Phương thức POST dành cho API cần xác thực
  postAuth<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.axiosAuthInstance.post(url, data);
  }

  // Phương thức POST dành cho API không cần xác thực
  postNoAuth<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.axiosNoAuthInstance.post(url, data);
  }

  // Phương thức PUT dành cho API cần xác thực
  putAuth<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.axiosAuthInstance.put(url, data);
  }

  // Phương thức PUT dành cho API không cần xác thực
  putNoAuth<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    return this.axiosNoAuthInstance.put(url, data);
  }

  // Phương thức DELETE dành cho API cần xác thực
  deleteAuth<T>(url: string): Promise<AxiosResponse<T>> {
    return this.axiosAuthInstance.delete(url);
  }

  // Phương thức DELETE dành cho API không cần xác thực
  deleteNoAuth<T>(url: string): Promise<AxiosResponse<T>> {
    return this.axiosNoAuthInstance.delete(url);
  }
}
