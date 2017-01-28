interface User {
  id?: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

interface Room {
  id?: number;
  name?: number;
  users?: User[];
  videos: Video[];
}

interface Video {
  id?: number;
  youtubeId?: string;
  title?: string;
  room?: Room;
  currentPosition?: number;
}
