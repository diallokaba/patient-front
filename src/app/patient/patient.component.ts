import {Component, OnInit, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { PatientService } from '../services/patient.service';
import { IPatient } from '../models/patient.model';
import { MatDialog } from '@angular/material/dialog';
import { NewPatientComponent } from './new-patient/new-patient.component';
import Swal from 'sweetalert2';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatTableModule, DatePipe, MatTooltipModule, MatPaginator, MatSort, MatFormField, MatLabel, MatInput],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit {
  // Colonnes affichées
  displayedColumns: string[] = ['nom', 'prenom', 'sexe', 'dateNaissance', 'poids', 'taille', 'actions'];

  //patients: IPatient[] = [];

  dataSource!: MatTableDataSource<IPatient>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort | null;

  constructor(private patientService: PatientService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.getAllPatients();

    // Configurer un filtre personnalisé
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: IPatient, filter: string) => {
        const transformedFilter = filter.trim().toLowerCase();
        return (
          data.nom?.toLowerCase().includes(transformedFilter) ||
          data.prenom?.toLowerCase().includes(transformedFilter)
        );
      };
    }
  }

  getAllPatients() {
    this.patientService.all().subscribe({
      next: (data: IPatient[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des patients :", error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddPatientModal(){
    const dialogRef = this.dialog.open(NewPatientComponent, {
      width: '600px',
      height: '550px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formattedDate = new DatePipe('en-US').transform(result.dateNaissance, 'yyyy-MM-dd');
        const formattedPatient = {
          ...result,
          dateNaissance: formattedDate,
        };

        this.patientService.create(formattedPatient).subscribe({
          next: (data: any) => {
            console.log(data);
            Swal.fire('Succès', 'Le patient a été ajouté avec succès', 'success');
            this.getAllPatients();
          },
          error: (error) => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout du patient', 'error');
            console.error(error);
          }
        });
      }
    });
  }

  viewDetails(id: string) {
    this.router.navigateByUrl(`home/patient-details/${id}`);
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
        console.log(updatedPatient);
        console.log(updatedPatient.id);
        this.patientService.update(updatedPatient).subscribe({
          next: (data: any) => {
            Swal.fire('Succès', 'Le patient a été mis à jour avec succès', 'success');
            this.getAllPatients();
          },
          error: (error) => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du patient', 'error');
            console.error(error);
          }
        });
      }
    });
  }

  deletePatient(id: string) {
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
            this.getAllPatients(); // Actualiser la liste après suppression
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
