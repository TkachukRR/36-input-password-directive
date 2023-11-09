import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { PasswordState } from "../../interfaces/password-state";
import { InputStatus } from "../../enums/input-status";

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.scss'
})
export class InputPasswordComponent implements OnDestroy{
  inputPassword: FormControl = new FormControl('')
  passwordState: PasswordState = { status: InputStatus.empty }

  valueSub = this.inputPassword.valueChanges.subscribe(val => this.checkPasswordState(val))

  ngOnDestroy() {
    this.valueSub.unsubscribe()
  }

  checkPasswordState(password: string){
    switch (true) {
      case password.length === 0:
        this.passwordState.status = InputStatus.empty;
        break;
      case password.length < 8:
        this.passwordState.status = InputStatus.short;
        break;
      default:
        this.passwordState.status = InputStatus.strength;
        break;
    }
  }
}
