import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PiChartComponent } from '../pi-chart/pi-chart.component';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonModule, PiChartComponent],
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
