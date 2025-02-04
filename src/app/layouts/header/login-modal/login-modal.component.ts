import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  loginWithGoogle() {
    // Redirect tới URL Google Auth
    window.location.href = `${environment.BASE_URL}/provide/google/callback`;
  }
}
