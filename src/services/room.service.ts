import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';

@Injectable()
export class RoomService {
    constructor(private http: Http) { }

    async getAll(): Promise<Room[]> {
        const response = await this.http.get(`${environment.apiUrl}/rooms`, this.getOptions()).toPromise();
        return response.json();
    }

    private getOptions() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return new RequestOptions({ headers, withCredentials: true });
    }
}
