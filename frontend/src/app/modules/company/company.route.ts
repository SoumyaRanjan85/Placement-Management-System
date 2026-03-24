import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Company Components
import { CompanyDashboardComponent } from './components/company-dash-board/company-dash-board';
import { CompanyProfileComponent } from './components/company-profile/company-profile';

// Jobs Components
import { JobPostingsComponent } from './components/company-jobs/job-postings/job-postings';
import { JobListComponent } from './components/company-jobs/job-list/job-list';
import { JobCreateComponent } from './components/company-jobs/job-create/job-create';
import { JobEditComponent } from './components/company-jobs/job-edit/job-edit';

// Application Management Components
import { ApplicationListComponent } from './components/application-management/application-list/application-list';
import { ApplicationFiltersComponent } from './components/application-management/application-filters/application-filters';
import { CandidateProfileComponent } from './components/application-management/candidate-profile/candidate-profile';
import { ShortlistCandidatesComponent } from './components/application-management/shortlist-candidates/shortlist-candidates';

// Analytics Components

import { AnalyticsDashboard } from './components/analytics/analytics-dashboard/analytics-dashboard';
import { Reports} from './components/analytics/reports/reports';

// Communication Components

import { Messaging } from './components/communication/messaging/messaging';
import { Notifications } from './components/communication/notifications/notifications';

// Placement Drive Components
import { DriveList } from './components/placement-drive/drive-list/drive-list';
import { DriveDetails } from './components/placement-drive/drive-details/drive-details';
import { ScheduleDrive } from './components/placement-drive/schedule-drive/schedule-drive';

export const COMPANY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: CompanyDashboardComponent,
    data: { title: 'Dashboard' }
  },
  {
    path: 'profile',
    component: CompanyProfileComponent,
    data: { title: 'Company Profile' }
  },
  {
    path: 'jobs',
    component: JobPostingsComponent,
    data: { title: 'Jobs' },
    children: [
      {
        path: '',
        component: JobListComponent,
        data: { title: 'Job Listings' }
      },
      {
        path: 'create',
        component: JobCreateComponent,
        data: { title: 'Create Job' }
      },
      {
        path: 'edit/:id',
        component: JobEditComponent,
        data: { title: 'Edit Job' }
      }
    ]
  },
  {
    path: 'applications',
    data: { title: 'Applications' },
    children: [
      {
        path: '',
        component: ApplicationListComponent,
        data: { title: 'All Applications' }
      },
      {
        path: 'filters',
        component: ApplicationFiltersComponent,
        data: { title: 'Application Filters' }
      },
      {
        path: 'candidate/:id',
        component: CandidateProfileComponent,
        data: { title: 'Candidate Profile' }
      },
      {
        path: 'shortlisted',
        component: ShortlistCandidatesComponent,
        data: { title: 'Shortlisted Candidates' }
      }
    ]
  },
  {
    path: 'drives',
    data: { title: 'Placement Drives' },
    children: [
      {
        path: '',
        component: DriveList,
        data: { title: 'Drive List' }
      },
      {
        path: 'schedule',
        component: ScheduleDrive,
        data: { title: 'Schedule Drive' }
      },
      {
        path: 'details/:id',
        component: DriveDetails,
        data: { title: 'Drive Details' }
      }
    ]
  },
  {
    path: 'analytics',
 
    data: { title: 'Analytics' },
    children: [
      {
        path: '',
        component: AnalyticsDashboard,
        data: { title: 'Analytics Dashboard' }
      },
      {
        path: 'reports',
        component: Reports,
        data: { title: 'Reports' }
      }
    ]
  },
  {
    path: 'communication',
    data: { title: 'Communication' },
    children: [
      {
        path: '',
        redirectTo: 'notifications',
        pathMatch: 'full'
      },
      {
        path: 'notifications',
        component: Notifications,
        data: { title: 'Notifications' }
      },
      {
        path: 'messaging',
        component: Messaging,
        data: { title: 'Messaging' }
      }
    ]
  },
  // Wildcard route for 404 - redirect to dashboard
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(COMPANY_ROUTES)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }