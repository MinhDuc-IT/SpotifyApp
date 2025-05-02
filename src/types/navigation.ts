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
    Library: undefined;
    Profile: undefined;
    EditProfile: undefined;
    CreatePlaylist: undefined;
    Liked: undefined;
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