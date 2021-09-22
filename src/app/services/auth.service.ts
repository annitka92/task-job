import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Response} from "../interfaces/responsetask.interface";
import {BehaviorSubject, Observable} from "rxjs";
import Utils from "../utils/utils";
import {environment} from "../../environments/environment";

const baseUrl = environment.baseUrl;
const developer = environment.developer;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  public currentTokenSubject: BehaviorSubject<Boolean>;

  constructor(private http: HttpClient) {
    // @ts-ignore
    this.currentTokenSubject = new BehaviorSubject<Boolean>();
    if (localStorage.getItem('authToken')) {
      this.currentTokenSubject.next(true);
    }

  }

  login(data: object): Observable<Response> {
    const body = Utils.transformDataToFormGroup(data)
    return this.http.post<Response>(`${baseUrl}login?${developer}`, body).pipe(map((resp: Response) => {
      if (resp.status === 'ok') {
        localStorage.setItem('authToken', resp.message.token);
        this.currentTokenSubject.next(true);
      }
      return resp;
    }))
  }

  logout() {
    localStorage.removeItem('authToken');
    // @ts-ignore
    this.currentTokenSubject.next(false);
  }
}
