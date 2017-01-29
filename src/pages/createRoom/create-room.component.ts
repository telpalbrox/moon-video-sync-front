import { Component } from '@angular/core';
import { RoomService } from '../../services/room.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html'
})
export class CreateRoomComponent {
  name: string;

  constructor(
    private roomService: RoomService,
    private router: Router
  ) { }

  async onSubmit() {
    try {
      const room = await this.roomService.createRoom(this.name);
      await this.router.navigate(['/rooms', room.id]);
    } catch (err) {

    }
  }
}
