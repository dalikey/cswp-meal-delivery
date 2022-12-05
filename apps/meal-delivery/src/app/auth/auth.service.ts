import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserIdentity, UserInfo, UserLogin } from '@md/data';
import { Router } from '@angular/router';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<UserInfo | undefined>(undefined);
  private readonly CURRENT_USER = 'currentuser';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private router: Router) {
    this.getUserFromLocalStorage()
      .pipe(
        // switchMap is overbodig als we validateToken() niet gebruiken...
        switchMap((user: UserInfo | undefined) => {
          if (user) {
            console.log('User found in local storage');
            this.currentUser$.next(user);
            // return this.validateToken(user);
            return of(user);
          } else {
            console.log(`No current user found`);
            return of(undefined);
          }
        })
      )
      .subscribe(() => console.log('Startup auth done'));
  }

  login(formData: UserLogin): Observable<UserIdentity | undefined> {
    return this.http
      .post<UserIdentity>(
        `http://localhost:3333/auth-api/auth/login`,
        formData,
        {
          headers: this.headers,
        }
      )
      .pipe(
        tap(console.log),
        map((data: any) => data.result),
        map((user: UserInfo) => {
          this.saveUserToLocalStorage(user);
          this.currentUser$.next(user);
          return user;
        }),
        catchError((error) => {
          console.log('error:', error);
          console.log('error.message:', error.message);
          console.log('error.error.message:', error.error.message);
          return of(undefined);
        })
      );
  }

  register(userData: UserInfo): Observable<UserInfo | undefined> {
    console.log(userData);
    return this.http
      .post<UserInfo>(`user`, userData, {
        headers: this.headers,
      })
      .pipe(
        map((user) => {
          this.saveUserToLocalStorage(user);
          this.currentUser$.next(user);
          return user;
        }),
        catchError((error) => {
          console.log('error:', error);
          console.log('error.message:', error.message);
          console.log('error.error.message:', error.error.message);
          return of(undefined);
        })
      );
  }

  logout(): void {
    this.router
      .navigate(['/'])
      .then((success) => {
        if (success) {
          console.log('logout - removing local user info');
          localStorage.removeItem(this.CURRENT_USER);
          this.currentUser$.next(undefined);
        } else {
          console.log('navigate result:', success);
        }
      })
      .catch((error) => console.log('not logged out!'));
  }

  getUserFromLocalStorage(): Observable<UserInfo | undefined> {
    const userData = localStorage.getItem(this.CURRENT_USER);
    if (userData) {
      const localUser = JSON.parse(userData);
      return of(localUser);
    } else {
      return of(undefined);
    }
  }

  private saveUserToLocalStorage(user: UserInfo): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
    }
  }

  userMayEdit(itemUserId: string): Observable<boolean> {
    console.log('userMayEdit');
    return this.currentUser$.pipe(
      map((user: UserInfo | undefined) =>
        user ? user.id === itemUserId : false
      )
    );
  }

  getAuthorizationToken(): string | undefined {
    const userData = localStorage.getItem(this.CURRENT_USER);
    if (userData) {
      const user: UserInfo = JSON.parse(userData);

      console.log('LET OP, TO DO!');
      return user.name; // user.token;
    }
    return undefined;
  }
}
