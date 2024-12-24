export interface IPatient {
    id?: string;
    nom?: string;
    prenom?: string;
    taille?: number;
    poids?: number;
    sexe?: string;
    dateNaissance?: Date;
    contacts?: any [];
}

export class Utilisateur implements IPatient {
    constructor(
        public id?: string,
        public nom?: string,
        public prenom?: string,
        public taille?: number,
        public poids?: number,
        public sexe?: string,
        public dateNaissance?: Date,
        public contacts?: any []
    ) {}
}
