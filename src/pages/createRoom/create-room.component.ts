import { Component } from '@angular/core';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html'
})
export class CreateRoomComponent {
  name: string;

  constructor(private roomService: RoomService) { }

  onSubmit() {
    this.roomService.createRoom(this.name);
  }
}
