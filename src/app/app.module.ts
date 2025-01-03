import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// App Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';

// Import Header, Footer
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';

// Import các component
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { BlogComponent } from './pages/blog/blog.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { ModalComponent } from './pages/detail/modal/modal.component';
import { CommonModule } from '@angular/common';
import { ModalChildComponent } from './pages/detail/modal/modal-child/modal-child.component';
import { ModalChildestComponent } from './pages/detail/modal/modal-child/modal-childest/modal-childest.component';
import { LoginModalComponent } from './layouts/header/login-modal/login-modal.component';
import { GenreComponent } from './pages/genre/genre.component';

@NgModule({
  declarations: [
    DefaultLayoutComponent,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DetailComponent,
    BlogComponent,
    GenreComponent,
    ModalComponent,
    ModalChildComponent,
    ModalChildestComponent,
    LoginModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
