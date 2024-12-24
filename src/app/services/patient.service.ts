import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { IPatient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }

  all(): Observable<IPatient[]>{
    return this.http.get<IPatient[]>(`${environment}/patients`);
  }

  create(patient: IPatient): Observable<any>{
    return this.http.post(`${environment}/patients/new`, patient);
  }

  getPatientById(id?: string): Observable<IPatient>{
    return this.http.get<IPatient>(`${environment}/patients/${id}`);
  }

  update(patient: IPatient): Observable<any>{
    console.log(patient.id);
    return this.http.put(`${environment}/patients/update/${patient.id}`, patient);
  }

  delete(patientId?: string): Observable<any>{
    return this.http.delete(`${environment}/patients/delete/${patientId}`);
  }
}
