import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient) { }

  register(name: string) {
   return this.http.post<any>(`http://localhost:4000/addUser`, { name:name })
  }

  getServers() {
    return this.http.get<any>(`http://localhost:4000/getServers`)
   }

   joinServer(name: string, server: string) {
    return this.http.put<any>(`http://localhost:4000/joinServer`, { user:name, server:server})
   }
}
