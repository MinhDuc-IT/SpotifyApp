import { NavigatorScreenParams } from '@react-navigation/native';

export type LibraryStackParamList = {
  Library: undefined;
  DownLoad: undefined;
};

// Type for the stack navigator
export type RootStackParamList = {
    Home: undefined;
    Admin: undefined;
    Login: undefined;
    SignUp: undefined;
    Start: undefined;
    Search: undefined;
    SearchDetail: undefined;
    Premium: undefined;
    LibraryStack: NavigatorScreenParams<LibraryStackParamList>;
    Library: undefined;
    Profile: undefined;
    EditProfile: undefined;
    DownLoad: undefined;
    CreatePlaylist: undefined;
    Liked: undefined;
    LikedSongsDownload: undefined;
    Info: {
        item: {
          songId: number;
          title: string;
          artistName: string;
          album: string;
          albumID: number;
          thumbnailUrl: string;
          duration: string;
          audioUrl: string;
        };
      }; 
    PlayList: undefined;
    Player: undefined;     
};