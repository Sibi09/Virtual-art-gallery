import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../../shared/services/event.service';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent {
  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    date: ['', Validators.required],
    type: ['live', Validators.required],
    link: ['']
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eventService: EventService
  ) {}

  save(): void {
    if (this.form.invalid) return;

    this.eventService.createEvent(this.form.value).subscribe({
      next: () => this.router.navigate(['/events']),
      error: err => {
        console.error(err);
        alert(err.status === 401 ? 'Bejelentkezés szükséges!' : 'Hiba az esemény mentésekor: ' + err.message);
      }
    });
  }
}
