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
      state('normal', style({ transform: 'rotate(0deg)' })),
      state('rotated', style({ transform: 'rotate(360deg)' })),
      transition('normal <=> rotated', animate('5s linear')),
    ]),
  ],
})
export class HomeComponent {
  videoSource = 'assets/stocks_vid.mp4';
  imageSource = 'assets/bg-image-white.png';
  imageState = 'normal';
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  // imageState = 'rotating'; // Initial state for the animation

  rotateImage() {
    setInterval(() => {
      this.imageState = this.imageState === 'normal' ? 'rotated' : 'normal';
    }, 5000);
  }

  onAccess() {
    this.router.navigateByUrl('/dashboard');
  }

  onClickLogout() {
    this.auth.logout();
  }
}
