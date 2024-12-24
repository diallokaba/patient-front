import {Component, Inject} from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-new-patient',
  standalone: true,
  templateUrl: './new-patient.component.html',
  styleUrl: './new-patient.component.css',
  imports: [
    FormsModule,
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogClose,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatNativeDateModule
  ]
})
export class NewPatientComponent {

  patientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewPatientComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
  ){

    this.patientForm = this.fb.group({
      nom: [data?.nom || '', Validators.required],
      prenom: [data?.prenom || '', Validators.required],
      dateNaissance: [data?.dateNaissance || '', Validators.required],
      sexe: [data?.sexe || '', Validators.required],
      poids: [data?.poids || null, Validators.required],
      taille: [data?.taille || null, Validators.required],
      contacts: this.fb.array([]),
    });

    if (data?.contacts) {
      data.contacts.forEach((contact: any) => {
        this.addContact(contact);
      });
    }
  }

  get contacts(): FormArray {
    return this.patientForm.get('contacts') as FormArray;
  }

  /*addContact() {
    this.contacts.push(
      this.fb.group({
        type: ['EMAIL', Validators.required],
        valeur: ['', Validators.required],
      })
    );
  }*/

  addContact(contact?: { type: string; valeur: string }) {
    this.contacts.push(
      this.fb.group({
        type: [contact?.type || 'EMAIL', Validators.required],
        valeur: [contact?.valeur || '', Validators.required],
      })
    );
  }

  removeContact(index: number) {
    this.contacts.removeAt(index);
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.dialogRef.close(this.patientForm.value);
    }
  }
}
