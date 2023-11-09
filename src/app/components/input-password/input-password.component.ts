import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.scss'
})
export class InputPasswordComponent {
  inputPassword: FormControl = new FormControl('')
}
