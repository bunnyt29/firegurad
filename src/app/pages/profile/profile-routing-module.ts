import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'details',
    loadComponent: () =>
      import('./components/details/details').then((m) => m.Details)
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./components/edit/edit').then((m) => m.Edit)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
