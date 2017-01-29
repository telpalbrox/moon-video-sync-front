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
  currentVideo: Video;

  constructor(private roomService: RoomService, private route: ActivatedRoute) { }

  async ngOnInit() {
    const id = parseInt(this.route.snapshot.params['id']);
    await this.roomService.joinRoom(id, {
      onDeleteVideo: this.onDeleteVideo.bind(this),
      onAddVideo: this.onAddVideo.bind(this),
      onChangeVideo: this.onChangeVideo.bind(this)
    });
    this.room = await this.roomService.getRoom(id);
    setTimeout(async () => {
      this.player = YouTubePlayer('yt-player', {
        playerVars: {
          // controls: 0,
          // hideUi: true
        }
      });
      this.player.addEventListener('onStateChange', (event: YT.EventArgs) => event.data === 0 && this.onVideoEnded.call(this));
      this.currentVideo = this.room.videos.find((video) => video.id === this.room.currentVideoId);
      if (!this.currentVideo) {
        return;
      }
      await this.player.loadVideoById(this.currentVideo.youtubeId);
      if (this.currentVideo.startedPlayed) {
        const startedDate = new Date(this.currentVideo.startedPlayed);
        const now = new Date();
        const seconds = (now.getTime() - startedDate.getTime()) / 1000;
        await this.player.seekTo(seconds);
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
    if (!this.currentVideo) {
      this.currentVideo = this.room.videos[0];
      this.player.loadVideoById(this.currentVideo.youtubeId);
    }
  }

  async onVideoEnded() {
    const nextVideo = this.getNextVideo();
    if (nextVideo) {
      this.player.loadVideoById(nextVideo.youtubeId);
      this.roomService.changeVideo(nextVideo.id, false);
    }
  }

  async onChangeVideo(video: Video) {
    this.currentVideo = this.room.videos.find((roomVideo) => video.id == roomVideo.id);
    if (this.currentVideo) {
      await this.player.loadVideoById(video.youtubeId);
    }
  }

  playVideoClick(video: Video) {
    this.roomService.changeVideo(video.id, true);
  }

  getNextVideo() {
    return this.room.videos[this.room.videos.indexOf(this.currentVideo) + 1];
  }
}
