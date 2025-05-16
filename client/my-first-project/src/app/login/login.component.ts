import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(form: NgForm): void {
    if (form.invalid) {
      this.error = 'Please fill out all required fields correctly.';
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        console.log('Sikeres bejelentkezés');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || 'Bejelentkezés sikertelen.';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/signup']);
  }
  
}
