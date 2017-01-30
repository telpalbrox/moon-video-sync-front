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

  async deleteRoom(id: number) {
    await this.http.delete(`${environment.apiUrl}/rooms/${id}`, this.getOptions()).toPromise();
  }

  async addVideoToRoom(roomId: number, youtubeId: string) {
    const response = await this.http.post(`${environment.apiUrl}/rooms/${roomId}/videos`, {
      youtubeId
    }, this.getOptions()).toPromise();
    return response.json();
  }

  async deleteVideoFromRoom(roomId: number, videoId: number) {
    const response = await this.http.delete(`${environment.apiUrl}/rooms/${roomId}/videos/${videoId}`, this.getOptions()).toPromise();
    return response.json();
  }

  async joinRoom(roomId: number, listeners: {
    onDeleteVideo: (video: Video) => void,
    onAddVideo: (video: Video) => void,
    onChangeVideo: (video: Video) => void,
    onUserJoin: (user: User) => void,
    onUserLeave: (user: User) => void
  }) {
    await this.socketService.connect();
    this.socketService.emit('join room', { id: roomId });
    this.socketService.on('pause song', () => {
      console.log('pause song');
      console.log(roomId);
    });
    this.socketService.on('video added', (video) => listeners.onAddVideo(video));
    this.socketService.on('video deleted', (video) => listeners.onDeleteVideo(video));
    this.socketService.on('video changed', (video) => listeners.onChangeVideo(video));
    this.socketService.on('user join', (user) => listeners.onUserJoin(user));
    this.socketService.on('user leave', (user) => listeners.onUserLeave(user));
  }

  leaveRoom(id: number) {
    this.socketService.emit('leave room', { id });
    this.socketService.disconnect();
  }

  changeVideo(id: number, emit: boolean) {
    this.socketService.emit('change video', { id, emit });
  }

  pauseSong() {
    this.socketService.emit('pause song');
  }

  private getOptions() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return new RequestOptions({ headers, withCredentials: true });
  }
}
