// src/app/layouts/modules/company/company-layout/company-layout.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

interface CompanyStats {
  activeJobs: number;
  totalApplications: number;
  pendingReviews: number;
  upcomingDrives: number;
  unreadNotifications: number;
}

interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-company-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './company-layout.html',
  styleUrls: ['./company-layout.css']
})
export class CompanyLayoutComponent implements OnInit, OnDestroy {
  userName: string = 'John Doe';
  userRole: string = 'HR Manager';
  activeSection: string = 'dashboard';
  private routerSubscription: Subscription;

  companyProfile: CompanyProfile = {
    id: '',
    name: 'Tech Corp Solutions',
    logo: '',
    status: 'approved'
  };

  dashboardStats: CompanyStats = {
    activeJobs: 12,
    totalApplications: 145,
    pendingReviews: 23,
    upcomingDrives: 3,
    unreadNotifications: 8
  };

  constructor(private router: Router) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveSection(event.url);
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.updateActiveSection(this.router.url);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userName = user.name || this.userName;
        this.userRole = user.role || this.userRole;
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }

  private updateActiveSection(url: string): void {
    if (url.includes('/dashboard') || url === '/company') {
      this.activeSection = 'dashboard';
    } else if (url.includes('/profile')) {
      this.activeSection = 'profile';
    } else if (url.includes('/jobs')) {
      this.activeSection = 'jobs';
    } else if (url.includes('/applications')) {
      this.activeSection = 'applications';
    } else if (url.includes('/drives')) {
      this.activeSection = 'drives';
    } else if (url.includes('/analytics')) {
      this.activeSection = 'analytics';
    } else if (url.includes('/communication')) {
      this.activeSection = 'communication';
    }
  }

  navigateTo(section: string): void {
    this.activeSection = section;
    const routes: { [key: string]: string } = {
      dashboard: '/company/dashboard',
      profile: '/company/profile',
      jobs: '/company/jobs',
      applications: '/company/applications',
      drives: '/company/drives',
      analytics: '/company/analytics',
      communication: '/company/communication'
    };
    
    if (routes[section]) {
      this.router.navigate([routes[section]]);
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  takeScreenshot(): void {
    console.log('Taking screenshot...');
    alert('Screenshot feature would capture the current dashboard view');
  }

  getNotificationCount(): number {
    return this.dashboardStats.unreadNotifications;
  }

  getStatusClass(): string {
    return `status-${this.companyProfile.status}`;
  }
}