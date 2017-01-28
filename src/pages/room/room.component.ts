import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import YouTubePlayer from 'youtube-player';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class RoomComponent implements OnInit, OnDestroy {
  room: Room;
  youtubeId: string;
  player: any;

  constructor(private roomService: RoomService, private route: ActivatedRoute) { }

  async ngOnInit() {
    const id = parseInt(this.route.snapshot.params['id']);
    await this.roomService.joinRoom(id, {
      onDeleteVideo: this.onDeleteVideo.bind(this),
      onAddVideo: this.onAddVideo.bind(this)
    });
    this.room = await this.roomService.getRoom(id);
    setTimeout(async () => {
      this.player = YouTubePlayer('yt-player', {
        playerVars: {
          controls: 0,
          hideUi: true
        }
      });
      const video = this.room.videos.find((video) => video.id === this.room.currentVideoId);
      console.log(video);
      console.log(this.room);
      if (!video) {
        return;
      }
      await this.player.loadVideoById(video.youtubeId);
      if (!this.room.playing) {
        this.player.pauseVideo();
      }
    }, 10);
  }

  ngOnDestroy() {
    this.roomService.leaveRoom(this.room.id);
    this.player.destroy();
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
