import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {Response} from "../interfaces/responsetask.interface";
import Utils from "../utils/utils";
import {environment} from "../../environments/environment";

const baseUrl = environment.baseUrl;
const developer = environment.developer;

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private http: HttpClient) {
  }

  getTasksList(params: any): Observable<Response> {
    return this.http.get<Response>(`${baseUrl}?${developer}`,
      {params: params}).pipe(map((resp: Response) => resp));
  }

  addTask(data: any) {
    const body = Utils.transformDataToFormGroup(data);
    return this.http.post(`${baseUrl}create?${developer}`, body);
  }

  editTask(data: any) {
    const body = Utils.transformDataToFormGroup(data);
    return this.http.post(`${baseUrl}edit/${data.id}?${developer}`, body);
  }
}
