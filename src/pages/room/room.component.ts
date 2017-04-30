import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  messages: ChatMessage[] = [];
  users: User[] = [];
  message: string;
  youtubePlaylistId: string;

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    const id = parseInt(this.route.snapshot.params['id']);
    await this.roomService.joinRoom(id, {
      onDeleteVideo: this.onDeleteVideo.bind(this),
      onAddVideo: this.onAddVideo.bind(this),
      onChangeVideo: this.onChangeVideo.bind(this),
      onUserJoin: this.onUserJoin.bind(this),
      onUserLeave: this.onUserLeave.bind(this),
      onNewMessage: this.onNewMessage.bind(this)
    });
    try {
      this.room = await this.roomService.getRoom(id);
      this.users = this.room.users;
      this.users = this.users.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      });
    } catch (err) {
      await this.router.navigate(['/login']);
      return;
    }
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
    this.room && this.roomService.leaveRoom(this.room.id);
    this.player && this.player.destroy();
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

  onUserJoin(user: User) {
    // FIXME show logged when navigating to the room from another page
    this.users.push(user);
    this.messages.push({
      sentBy: 'System',
      message: `${user.firstName} ${user.lastName} has joined the room!`,
      date: new Date().toISOString()
    });
  }

  onUserLeave(userLeaving: User) {
    this.users = this.users.filter((user) => user.id !== userLeaving.id);
    this.messages.push({
      sentBy: 'System',
      message: `${userLeaving.firstName} ${userLeaving.lastName} has left the room!`,
      date: new Date().toISOString()
    });
  }

  onNewMessage(message: ChatMessage) {
    this.messages.push(message);
  }

  onSendMessageSumbit() {
    console.log('message submit');
    if (!this.message) {
      return;
    }
    this.roomService.sendMessage(this.message);
    this.message = '';
  }

  async onImportYoutubePlaylistClick() {
    await this.roomService.importPlaylist(this.room.id, this.youtubePlaylistId);
    this.youtubePlaylistId = '';
  }
}
