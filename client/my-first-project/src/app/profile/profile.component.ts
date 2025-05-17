import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  form = this.fb.group({
    username: [''],
    email: [''],
    bio: [''],
    location: [''],
    profileImage: ['']
  });

  loading = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.auth.getCurrentUser(true).subscribe(user => {
      this.form.patchValue(user);
      this.loading = false;
    });
  }

  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  save(): void {
    const formData = new FormData();
    const raw = this.form.value;
  
    const keys: (keyof typeof raw)[] = ['username', 'email', 'bio', 'location'];
  
    keys.forEach(key => {
      const value = raw[key];
      if (value) {
        formData.append(key, value);
      }
    });
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    this.http.put('http://localhost:5000/app/users/me', formData, { withCredentials: true }).subscribe({
  next: () => alert('Profil frissítve!'),
  error: err => alert('Hiba: ' + err.message)
});
  }

}
