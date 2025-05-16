import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ArtworkService } from '../../shared/services/artwork.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-artwork-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './artwork-upload.component.html',
  styleUrls: ['./artwork-upload.component.scss']
})
export class ArtworkUploadComponent {
  form: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private artworkService: ArtworkService, private router: Router) {
    this.form = this.fb.group({
      title: [''],
      description: [''],
      price: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      alert('Kép kiválasztása kötelező!');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('description', this.form.value.description);
    formData.append('price', this.form.value.price);
    formData.append('image', this.selectedFile);

    this.artworkService.uploadArtwork(formData).subscribe({
      next: () => this.router.navigate(['/artworks']),
      error: () => alert('Feltöltés sikertelen')
    });
  }
}
