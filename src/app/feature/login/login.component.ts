import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(
        (response) => {
          sessionStorage.setItem('accessToken', response.access);
          sessionStorage.setItem('refreshToken', response.refresh);
          this.authService.setLoggedIn(true);  
          this.router.navigate(['/home']);
        },
        (error) => {
          alert('Invalid credentials');
        }
      );
    }
  }
}
