import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () =>
  import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  canActivate: [authGuard]
 },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'artist/:id',
    loadComponent: () =>
      import('./artist/artist-profile.component').then(m => m.ArtistProfileComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-artworks',
    loadComponent: () =>
      import('./artwork/artwork-list/artwork-list.component').then(m => m.ArtworkListComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'artist' }
  },
  {
    path: 'artworks/edit/:id',
    loadComponent: () =>
      import('./artwork/artwork-edit/artwork-edit.component').then(m => m.ArtworkEditComponent),
    canActivate: [authGuard]
  },
  {
    path: 'exhibitions',
    loadComponent: () =>
      import('./exhibition/exhibition-list/exhibition-list.component').then(m => m.ExhibitionListComponent)
  },
  {
    path: 'my-exhibitions',
    loadComponent: () =>
      import('./exhibition/exhibition-list/exhibition-list.component').then(m => m.ExhibitionListComponent)
  },  
  {
    path: 'exhibitions/edit/:id',
    loadComponent: () =>
      import('./exhibition/exhibition-edit/exhibition-edit.component').then(m => m.ExhibitionEditComponent)
  },
  {
    path: 'exhibitions/:id/assign',
    loadComponent: () =>
      import('./exhibition/assign-artworks.component').then(m => m.AssignArtworksComponent)
  },
  {
    path: 'exhibitions/new',
    loadComponent: () =>
      import('./exhibition/exhibition-edit/exhibition-edit.component').then(m => m.ExhibitionEditComponent)
  },
  {
    path: 'auctions',
    loadComponent: () =>
      import('./auction/auction-list/auction-list.component').then(m => m.AuctionListComponent)
  },
  {
    path: 'auctions/new',
    loadComponent: () =>
      import('./auction/auction-create/auction-create.component').then(m => m.AuctionCreateComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'artist' }
  },
  {
    path: 'auctions/:id',
    loadComponent: () =>
      import('./auction/auction-detail/auction-detail.component').then(m => m.AuctionDetailComponent)
  },
  {
    path: 'my-collection',
    loadComponent: () =>
      import('./collector/collector-gallery.component').then(m => m.CollectorGalleryComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'collector' }
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/event-list/event-list.component').then(m => m.EventListComponent)
  },
  {
    path: 'events/create',
    loadComponent: () =>
      import('./features/events/event-create/event-create.component').then(m => m.EventCreateComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'artist' }
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./gallery/gallery-view.component').then(m => m.GalleryViewComponent)
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./artwork/artwork-upload/artwork-upload.component').then(m => m.ArtworkUploadComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'artist' }
  },


  // fallback route
  { path: '**', redirectTo: '' }
];
