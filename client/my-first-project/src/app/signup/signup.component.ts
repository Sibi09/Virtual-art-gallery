import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  role = 'collector';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup(): void {
    const user = { username: this.username, email: this.email, password: this.password, role: this.role };
    this.authService.register(user).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.error = 'Registration failed'
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
