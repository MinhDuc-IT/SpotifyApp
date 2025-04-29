import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api';

interface ArtistInfo {
  id: number,
  name: string;
  image: string;
  monthlyListeners: string;
  description: string;
  isFollowed: boolean;
}

interface ArtistInfoCardProps {
  artistName: string;
}

const mockArtistInfo: ArtistInfo = {
  id: 1,
  name: "Nghệ sĩ ẩn danh",
  image: "https://picsum.photos/200",
  monthlyListeners: "0",
  description: "Chưa có thông tin",
  isFollowed: false,
};

export const ArtistInfoCard: React.FC<ArtistInfoCardProps> = ({ artistName }) => {
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        const response = await api.get(`/artist/info/${encodeURIComponent(artistName)}`);
        const dto = response.data;
        const data: ArtistInfo = {
          id: dto.artistID,
          name: dto.artistName,
          image: dto.image,
          monthlyListeners: "1M",
          description: dto.bio || "",
          isFollowed: dto.isFollowed,
        };

        console.log('ArtistInfo', data);
        setArtistInfo(data);
      } catch (error) {
        console.error('Error fetching artist info:', error);
        setArtistInfo(mockArtistInfo);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistInfo();
  }, [artistName]);

  const followArtist = async (id: number) => {
    try {
      const response = await api.post('/ArtistFollow/follow', {
        artistID: id
      })

      const data = response.data;
      Alert.alert('Thông báo', data);

      if(artistInfo) {
        setArtistInfo({...artistInfo, isFollowed: true});
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  const unFollowArtist = async (id: number) => {
    try {
      const response = await api.post('/ArtistFollow/unfollow', {
        artistID: id
      })

      const data = response.data;
      Alert.alert('Thông báo', data);

      if(artistInfo) {
        setArtistInfo({...artistInfo, isFollowed: false})
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  if (loading) {
    return <ActivityIndicator color="white" />;
  }

  if (!artistInfo) {
    return <Text style={{ color: 'white' }}>Không tìm thấy nghệ sĩ.</Text>;
  }

  return (
    <View style={styles.artistCard}>
      <Image source={{ uri: artistInfo.image }} style={styles.artistCardImage} />
      <View style={styles.artistCardInfo}>
        <Text style={styles.artistSectionTitle}>Giới thiệu về nghệ sĩ</Text>
        <Text style={styles.artistName}>{artistInfo.name}</Text>
        <Text style={styles.artistMonthlyListeners}>{artistInfo.monthlyListeners} người nghe hàng tháng</Text>
        <Text style={styles.artistDescription}>{artistInfo.description}</Text>

        {
          artistInfo.isFollowed ?
            <TouchableOpacity style={styles.artistFollowButton} onPress={() => unFollowArtist(artistInfo.id)}>
              <Text style={styles.artistFollowButtonText}>Đang theo dõi</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.artistFollowButton} onPress={() => followArtist(artistInfo.id)}>
              <Text style={styles.artistFollowButtonText}>Theo dõi</Text>
            </TouchableOpacity>
        }
        {/* <TouchableOpacity style={styles.artistFollowButton} onPress={() => followArtist(artistInfo.id)}>
          <Text style={styles.artistFollowButtonText}>Theo dõi</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  artistCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%'
  },
  artistCardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  artistCardInfo: {
    marginTop: 8,
  },
  artistSectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artistName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  artistMonthlyListeners: {
    color: '#B3B3B3',
    fontSize: 14,
    marginTop: 4,
  },
  artistDescription: {
    color: '#B3B3B3',
    fontSize: 14,
    marginTop: 2,
  },
  artistFollowButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  artistFollowButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
