import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgxTypedWriterModule } from 'ngx-typed-writer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgxTypedWriterModule],
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

  readonly sentencies: string[] = [
    'Simplify Your Portfolio Management!',
    'Stay Ahead with Real-Time Tracking.',
    'All Your Crypto in One Dashboard.',
    'Analyze. Optimize. Grow.',
    'Track Gains, Minimize Losses.',
    'Visualize Performance Effortlessly.',
    'Stay Informed, Stay Empowered.',
  ];

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

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }
}
