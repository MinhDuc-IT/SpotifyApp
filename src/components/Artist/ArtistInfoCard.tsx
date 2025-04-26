import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ArtistInfo {
  name: string;
  image: string;
  monthlyListeners: string;
  description: string;
}

interface ArtistInfoCardProps {
  artistName: string;
}

const mockArtistInfo: ArtistInfo = {
  name: "Nghệ sĩ ẩn danh",
  image: "https://picsum.photos/200",
  monthlyListeners: "0",
  description: "Chưa có thông tin",
};

export const ArtistInfoCard: React.FC<ArtistInfoCardProps> = ({ artistName }) => {
  const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        const response = await fetch(`https://api.example.com/artist/info?name=${encodeURIComponent(artistName)}`);
        const data: ArtistInfo = await response.json();
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

        <TouchableOpacity style={styles.artistFollowButton}>
          <Text style={styles.artistFollowButtonText}>Theo dõi</Text>
        </TouchableOpacity>
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
