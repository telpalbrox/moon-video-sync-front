import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
    private socketClient: SocketIOClient.Socket = null;
    constructor(private http: Http) { }

    connect() {
        if (!this.socketClient) {
            return this.socketClient = io(environment.apiUrl);
        }
        if (!this.socketClient.connected) {
            this.socketClient.connect();
        }
    }

    disconnect() {
        if (this.socketClient && this.socketClient.connected) {
            this.socketClient.removeAllListeners();
            this.socketClient.disconnect();
        }
    }

    on(event: string, callback: Function) {
        if (!this.socketClient || !this.socketClient.connected) {
            throw new Error('Socket is not connected');
        }
        this.socketClient.on(event, callback);
    }

    emit(event: string, ...args) {
        if (!this.socketClient || !this.socketClient.connected) {
            throw new Error('Socket is not connected');
        }
        this.socketClient.emit(event, ...args);
    }
}
