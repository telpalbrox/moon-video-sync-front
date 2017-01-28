import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';
import { SocketService } from './socket.service';

@Injectable()
export class RoomService {
  constructor(private http: Http, private socketService: SocketService) { }

  async getAll(): Promise<Room[]> {
    const response = await this.http.get(`${environment.apiUrl}/rooms`, this.getOptions()).toPromise();
    return response.json();
  }

  async createRoom(name: string): Promise<Room> {
    const response = await this.http.post(`${environment.apiUrl}/rooms`, {
      name
    }, this.getOptions()).toPromise();
    return response.json();
  }

  async getRoom(id: number): Promise<Room> {
    const response = await this.http.get(`${environment.apiUrl}/rooms/${id}`, this.getOptions()).toPromise();
    return response.json();
  }

  async joinRoom(roomId: number) {
    await this.socketService.connect();
    this.socketService.emit('join room', { id: roomId });
    this.socketService.on('pause song', () => {
      console.log('pause song');
      console.log(roomId);
    })
  }

  leaveRoom() {
    this.socketService.disconnect();
  }

  pauseSong() {
    this.socketService.emit('pause song');
  }

  private getOptions() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return new RequestOptions({ headers, withCredentials: true });
  }
}
