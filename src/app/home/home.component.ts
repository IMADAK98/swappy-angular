import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('rotate', [
      state(
        'rotating',
        style({
          transform: 'rotate(360deg)',
        }),
      ),
      transition('* => rotating', [
        animate(
          '5s linear',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: 0 }),
            style({ transform: 'rotate(360deg)', offset: 1 }),
          ]),
        ),
      ]),
    ]),
  ],
})
export class HomeComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  imageState = 'rotating'; // Initial state for the animation

  onAccess() {
    this.router.navigateByUrl('/dashboard');
  }

  onClickLogout() {
    this.auth.logout();
  }
}
