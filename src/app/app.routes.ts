import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DetailComponent } from './pages/detail/detail.component';
import { BlogComponent } from './pages/blog/blog.component';
import { GenreComponent } from './pages/genre/genre.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'detail/:movieId', component: DetailComponent },
      { path: 'genre', component: GenreComponent },
      { path: 'blog', component: BlogComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
