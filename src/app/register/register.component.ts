import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  text = "hello";
  testIf = true;
onClick() {
  this.text='not hello';
    
}
isHidden() {
  return false;
}
  profileForm: FormGroup;


  

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  handleSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    this.http.post<any>('http://localhost:8000/api/v1/auth/register', this.profileForm.value)
      .subscribe(
        data => {
          console.log('Registration successful', data);
          // Optionally, you can redirect the user to another page
        },
        error => {
          console.error('Registration failed', error);
          // Handle error (e.g., display error message to the user)
        }
      );
  }
}