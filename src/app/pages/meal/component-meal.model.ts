export class User {
  id: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  emailAddress: string | undefined;
  birthDate: Date | undefined;

  constructor(id: string, firstName: string) {
    this.id = id;
    // Verder aanvullen
  }
}