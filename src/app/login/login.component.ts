import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AppError } from '../common/app-error';
import { Unauthorized } from '../common/unauthorized-error';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    CardModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent {
  profileForm: FormGroup;
  invalidLogin: boolean = false;
  value = '';
  labelColor: string = 'text-gray-950';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  handleSubmit() {
    let formValue = this.profileForm.value;

    this.auth.logIn(formValue).subscribe({
      next: (res) => {
        if (res) {
          let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate([returnUrl || '/dashboard']);
        } else this.invalidLogin = true;
      },
      error: (err: AppError) => {
        if (err instanceof Unauthorized) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Email address or password incorrect`,
          });
          console.error(err);
        } else throw err;
      },
      complete: () => {
        console.log('Observations completed');
      },
    });
  }

  get email() {
    return this.profileForm.get('email');
  }

  get password() {
    return this.profileForm.get('password');
  }
}
