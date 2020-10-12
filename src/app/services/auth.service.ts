import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public UserState: Observable<User | null>;
  private UserSubject: BehaviorSubject<User | null>;

  public teste = 0;

  constructor(private http: HttpClient) {
    this.UserSubject = new BehaviorSubject<User>(this.User);
    this.UserState = this.UserSubject.asObservable();
  }

  public get User(): User | null {
    let user = JSON.parse(localStorage.getItem(environment.storage_name));

    if (!user) {
      user = JSON.parse(sessionStorage.getItem(environment.storage_name));
    }

    return user ? user : null;
  }

  private setUserStorage(user: User, isRemenber?: boolean): void {
    if (user) {
      localStorage.removeItem(environment.storage_name);
      sessionStorage.removeItem(environment.storage_name);
    } else {
      if (isRemenber) {
        localStorage.setItem(environment.storage_name, JSON.stringify(user));
      } else {
        sessionStorage.setItem(environment.storage_name, JSON.stringify(user));
      }
    }
  }

  public login(email: string, password: string, isRemenber?: boolean): Observable<User> {
    this.teste++;
    return this.http
      .post<User>(`${environment.url_api}/v1/auth`, {
        email,
        password,
      })
      .pipe(
        map((user) => {
          this.setUserStorage(user, isRemenber);
          this.UserSubject.next(user);
          return user;
        })
      );
  }

  public logout(): void {
    this.setUserStorage(null);
    this.UserSubject.next(null);
  }
}
