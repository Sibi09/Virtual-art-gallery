import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExhibitionService } from '../../shared/services/exhibition.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-exhibition-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './exhibition-edit.component.html',
  styleUrls: ['./exhibition-edit.component.scss']
})
export class ExhibitionEditComponent implements OnInit {
  form!: FormGroup;
  exhibitionId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private exhibitionService: ExhibitionService
  ) {}

  ngOnInit(): void {
    this.exhibitionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.exhibitionId;

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      isLive: [false]
    });

    if (this.isEditMode) {
      this.exhibitionService.getById(this.exhibitionId!).subscribe(data => {
        this.form.patchValue({
          title: data.title,
          description: data.description,
          date: new Date(data.date).toISOString().substring(0, 10),
          isLive: data.isLive
        });
      });
    }
    
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value;
    const req = this.isEditMode
      ? this.exhibitionService.update(this.exhibitionId!, data)
      : this.exhibitionService.create(data);

    req.subscribe({
      next: () => this.router.navigate(['/exhibitions']),
      error: () => alert('Mentés sikertelen.')
    });
  }
}
