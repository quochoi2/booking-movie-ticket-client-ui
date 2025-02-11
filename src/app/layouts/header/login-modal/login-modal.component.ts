import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  loginData = { username: '', password: '' };
  registerData = { fullName: '', email: '', username: '', password: '' };

  isLogin = true;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  closeModal() {
    this.close.emit();
  }

  switchToRegister() {
    this.isLogin = false;
  }

  switchToLogin() {
    this.isLogin = true;
  }

  // Login function
  login() {
    this.authService
      .login(this.loginData.username, this.loginData.password)
      .then((res: any) => {
        // console.log('Login successful', res);
        const accessToken = res.data.token.accessToken;
        localStorage.setItem('accessToken', accessToken);
        const decode = jwtDecode<any>(accessToken);
        const user = {
          fullName: decode.fullName,
          email: decode.email,
        };

        this.userService.setUser(user);
        alert('Login Successfully!');
        this.closeModal();
      })
      .catch((error: any) => {
        console.error('Login failed', error);
      });
  }

  // Register function
  register() {
    this.authService
      .register(
        this.registerData.fullName,
        this.registerData.email,
        this.registerData.username,
        this.registerData.password
      )
      .then((res: any) => {
        // console.log('Registration successful', res);
        alert('Registration successful!');
        this.isLogin = true;
      })
      .catch((error: any) => {
        console.error(': anyRegistration failed', error);
      });
  }

  loginWithGoogle() {
    window.location.href = `${environment.BASE_URL}/provide/google`;
  }
}
