import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html'
})
export class RoomsComponent implements OnInit {
  rooms: Room[];

  constructor(
    private router: Router,
    private roomService: RoomService
  ) { }

  async ngOnInit() {
    try {
      this.rooms = await this.roomService.getAll();
    } catch (err) {
      this.router.navigate(['/login'], {
        queryParams: {
          redirectTo: '/rooms'
        }
      });
    }
  }

  async deleteRoom(roomToDelete: Room) {
    await this.roomService.deleteRoom(roomToDelete.id);
    this.rooms = this.rooms.filter((room) => room.id !== roomToDelete.id);
  }
}
