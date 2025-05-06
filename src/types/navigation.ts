import {NavigatorScreenParams} from '@react-navigation/native';

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

  LikedInAlbum: {
    item: {
      songId: number;
      title: string;
      artistName: string;
      album: string;
      albumId: number;
      thumbnailUrl: string;
      duration: string;
      audioUrl: string;
    };
  };

  ArtistSongs: {
    item: {
      artistId: number;
      artistName: string;
      totalPlays: number;
      thumbnailUrl: string;
    };
  };

  MostPlayed: {
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
  Payment: undefined;
  // PaymentSuccess: undefined;
  // PaymentFailure: undefined;
  PaymentSuccess: {
    transactionId?: string;
    amount?: string;
    orderCode?: string;
    message?: string;
    paymentMethod?: string;
    orderDescription?: string;
    transactionDate?: string;
  };
  PaymentFailure: {
    transactionId?: string;
    amount?: string;
    orderCode?: string;
    message?: string;
    paymentMethod?: string;
    orderDescription?: string;
    transactionDate?: string;
  };
  MainApp: undefined;
};
