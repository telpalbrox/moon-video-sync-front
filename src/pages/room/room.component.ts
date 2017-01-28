import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class RoomComponent implements OnInit, OnDestroy {
  room: Room;
  youtubeId: string;

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

  async onAddVideo() {
    if (!this.youtubeId) {
      return;
    }
    const video = await this.roomService.addVideoToRoom(this.room.id, this.youtubeId);
    this.youtubeId = '';
    this.room.videos.push(video);
  }

  async onDeleteVideo(videoToDelete: Video) {
    await this.roomService.deleteVideoFromRoom(this.room.id, videoToDelete.id);
    this.room.videos = this.room.videos.filter((video) => video.id !== videoToDelete.id);
  }
}
