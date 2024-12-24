import { Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { PatientDetailsComponent } from './patient/patient-details/patient-details.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            { path: 'patient', component: PatientComponent },
            { path: 'patient-details/:id', component: PatientDetailsComponent },
            { path: 'contact', component: ContactComponent },
            {path: '', redirectTo: 'patient', pathMatch: 'full'}
        ]
    },
    { path: '**', redirectTo: 'home' }
];
