import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  profileForm: FormGroup;
  invalidLogin: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  handleSubmit() {
    this.auth.signUp(this.profileForm.value).subscribe({
      next: (res) => {
        if (res) {
          let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate([returnUrl || '/home']);
        } else this.invalidLogin = true;
      },

      error: (err: Error) => {
        alert('An error occurred sorry - please try again later nigga!');
        console.error(err);
      },
      complete: () => {
        alert('signup completed' + this.profileForm.value.firstName);
      },
    });
  }
}

// handleSubmit() {
//   this.auth.signUp(this.profileForm.value).subscribe((res) => {

//     if (res) {
//       let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
//       this.router.navigate([returnUrl || '/home']);
//     } else this.invalidLogin = true;
//   });
// }
