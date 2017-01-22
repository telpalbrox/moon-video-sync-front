import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';

@Injectable()
export class AuthService {
    constructor(private http: Http) {

    }

    login(email: string, password: string) {
        return this.http.post(`${environment.apiUrl}/login`, { email, password }, this.getOptions()).toPromise();
    }

    logout() {
        return this.http.post(`${environment.apiUrl}/logout`, {}, this.getOptions()).toPromise();
    }

    private getOptions() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return new RequestOptions({ headers, withCredentials: true });
    }
}
