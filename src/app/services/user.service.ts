import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { CustomJwtPayload } from '../pages/home/home.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  setUser(user: any): void {
    this.userSubject.next(user);
  }

  getUser(): any {
    return this.userSubject.getValue();
  }

  loadUserFromStorage(): void {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decode = jwtDecode<CustomJwtPayload>(accessToken);
        // console.log(decode);
        this.userSubject.next(decode);
      } catch (error) {
        console.error('Error decoding accessToken', error);
      }
    }
  }
}
