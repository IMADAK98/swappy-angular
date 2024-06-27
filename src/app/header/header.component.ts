import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUrl: string = '';

  Links = [
    { name: 'Home', route: '/home' },
    { name: 'Dashboard', route: '/dashboard' },
    { name: 'Login', route: '/login' },
    { name: 'Signup', route: '/signup' },
    { name: 'Logout', route: '/logout' },
  ] as const;

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  navigate(route: string) {
    if (route === '/logout') {
      this.onLogout();
    } else {
      this.router.navigateByUrl(route);
    }
  }

  onLogout() {
    this.auth.logout();
  }

  isActive(route: string): boolean {
    return this.currentUrl === route;
  }
}
