import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class RoomComponent implements OnInit, OnDestroy {
  room: Room;

  constructor(private roomService: RoomService, private route: ActivatedRoute) { }

  async ngOnInit() {
    const id = parseInt(this.route.snapshot.params['id']);
    this.room = await this.roomService.getRoom(id);
    await this.roomService.joinRoom(id);
  }

  ngOnDestroy() {
    this.roomService.leaveRoom();
  }

  testEvent() {
    this.roomService.pauseSong();
  }
}
