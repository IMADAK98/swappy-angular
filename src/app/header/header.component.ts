import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule, NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  onLogout() {
    this.auth.logout();
  }

  onHome() {
    this.router.navigateByUrl('/home');
  }
}
