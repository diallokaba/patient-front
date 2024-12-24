import {Component, OnInit} from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IPatient} from '../../models/patient.model';
import {CommonModule, DatePipe, NgIf} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {NewPatientComponent} from '../new-patient/new-patient.component';
import Swal from 'sweetalert2';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    CommonModule,
    MatTooltip,
  ],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.css'
})
export class PatientDetailsComponent implements OnInit {

  patient: IPatient = {};

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private patientService: PatientService, private router: Router) { }

  ngOnInit() {
    const patientId = this.route.snapshot.params['id'];
    this.getPatient(patientId);
  }

  getPatient(id?: string) {
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.patient = data;
        console.log(this.patient.contacts);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  backToPatientList(){
    this.router.navigateByUrl('/home');
  }

  editPatient(patient: IPatient) {
    if (!patient) return;
    const dialogRef = this.dialog.open(NewPatientComponent, {
      width: '600px',
      height: '550px',
      data: patient, // Passez les données du patient au modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formattedDate = new DatePipe('en-US').transform(result.dateNaissance, 'yyyy-MM-dd');
        const updatedPatient = {
          ...result,
          dateNaissance: formattedDate,
          id: patient.id,
        };
        this.patientService.update(updatedPatient).subscribe({
          next: (data: any) => {
            Swal.fire('Succès', 'Le patient a été mis à jour avec succès', 'success');
            this.getPatient(updatedPatient.id);
          },
          error: (error) => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du patient', 'error');
            console.error(error);
          }
        });
      }
    });
  }

  deletePatient(id?: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce patient ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.delete(id).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'Le patient a été supprimé avec succès.', 'success');
            this.router.navigateByUrl('/home');
          },
          error: (error) => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
            console.error(error);
          }
        });
      } else {
        Swal.fire('Annulé', 'Le patient n\'a pas été supprimé.', 'info');
      }
    });
  }
}
