import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

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
    ModalComponent,
  ],
  imports: [AppRoutingModule, BrowserModule, CommonModule, RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
