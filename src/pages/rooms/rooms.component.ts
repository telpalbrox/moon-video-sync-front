import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html'
})
export class RoomsComponent implements OnInit, OnDestroy {
  rooms: Room[];

  constructor(private roomService: RoomService) { }

  async ngOnInit() {
    this.rooms = await this.roomService.getAll();
  }

  ngOnDestroy() {
    this.roomService.leaveRoom();
  }

  joinRoom(room: Room) {
    this.roomService.joinRoom(room.id);
  }

  pauseSong() {
    this.roomService.pauseSong();
  }
}
