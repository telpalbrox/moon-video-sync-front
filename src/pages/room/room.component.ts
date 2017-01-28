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
    await this.roomService.joinRoom(id, {
      onDeleteVideo: this.onDeleteVideo.bind(this),
      onAddVideo: this.onAddVideo.bind(this)
    });
  }

  ngOnDestroy() {
    this.roomService.leaveRoom();
  }

  testEvent() {
    this.roomService.pauseSong();
  }

  async onAddVideoClick() {
    if (!this.youtubeId) {
      return;
    }
    await this.roomService.addVideoToRoom(this.room.id, this.youtubeId);
    this.youtubeId = '';
  }

  async onDeleteVideoClick(videoToDelete: Video) {
    await this.roomService.deleteVideoFromRoom(this.room.id, videoToDelete.id);
  }

  onDeleteVideo(videoDeleted) {
    this.room.videos = this.room.videos.filter((video) => video.id !== videoDeleted.id);
  }

  onAddVideo(videoAdded) {
    this.room.videos.push(videoAdded);
  }
}
