import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from '../pages/login/login.component';
import { IndexComponent } from '../pages/index/index.component';
import { RegisterComponent } from '../pages/register/register.component';
import { RoomsComponent } from '../pages/rooms/rooms.component';
import { RoomComponent } from '../pages/room/room.component';
import { CreateRoomComponent } from '../pages/createRoom/create-room.component';

import { AuthService } from '../services/auth.service';
import { RoomService } from '../services/room.service';
import { SocketService } from '../services/socket.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    RegisterComponent,
    RoomsComponent,
    RoomComponent,
    CreateRoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    RoomService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
