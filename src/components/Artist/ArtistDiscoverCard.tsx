import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import api from '../../services/api';
import { Track } from 'react-native-track-player';
import { usePlayer } from '../../contexts/PlayerContextV2';

interface ArtistDiscoverCardProps {
    artistName: string;
}

interface Song {
    songId: string;
    title: string;
    artistName: string;
    album: string | null;
    albumId: string | null;
    thumbnailUrl: string;
    duration: number;
    audioUrl: string;
}


interface ArtistWithSongs {
    artistName: string;
    image: string;
    songs: Song[];
}

const mockRelatedArtists: ArtistWithSongs[] = [
    { artistName: "Nghệ sĩ A", image: "https://picsum.photos/200", songs: [] },
    { artistName: "Nghệ sĩ B", image: "https://picsum.photos/200", songs: [] },
    { artistName: "Nghệ sĩ C", image: "https://picsum.photos/200", songs: [] },
    { artistName: "Nghệ sĩ D", image: "https://picsum.photos/200", songs: [] },
];

export const ArtistDiscoverCard: React.FC<ArtistDiscoverCardProps> = ({ artistName }) => {
    const [relatedArtists, setRelatedArtists] = useState<ArtistWithSongs[]>([]);
    const [loading, setLoading] = useState(true);
    const { play } = usePlayer();

    useEffect(() => {
        const fetchRelatedArtists = async () => {
            try {
                const response = await api.get(`/artist/related/${encodeURIComponent(artistName)}`);
                const dto = response.data;

                // const relatedArtists: RelatedArtist[] = dto.songs.map((song: any) => ({
                //     name: song.title,
                //     image: song.thumbnailUrl,
                // }));

                setRelatedArtists(dto);
            } catch (error) {
                console.error('Error fetching related artists:', error);
                setRelatedArtists(mockRelatedArtists);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedArtists();
    }, [artistName]);

    const handlePlay = (artistName: string, song: Song) => {
        const convertedTrack: Track = {
            id: String(song.songId),
            url: song.audioUrl || '',
            title: song.title,
            artist: artistName,
            artwork: song.thumbnailUrl,
            duration: 180,
        };

        play(convertedTrack);
    }
    if (loading) {
        return <ActivityIndicator color="white" />;
    }

    return (
        <View style={styles.artistDiscoverCard}>
            <Text style={styles.artistSectionTitle}>Khám phá {artistName}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistDiscoverScroll}>
                {relatedArtists.map((item, index) => (
                    item.songs.map((s, i) => (
                        <Pressable key={i} style={styles.artistDiscoverItem} onPress={() => handlePlay(item.artistName, s)}>
                            <Image source={{ uri: s.thumbnailUrl }} style={styles.artistDiscoverImage} />
                            <Text style={styles.artistDiscoverText}>{s.title}</Text>
                        </Pressable>
                    ))
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    artistDiscoverCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        width: '100%',
    },
    artistSectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    artistDiscoverScroll: {
        marginTop: 12,
    },
    artistDiscoverItem: {
        marginRight: 12,
        width: 120,
    },
    artistDiscoverImage: {
        width: '100%',
        height: 140,
        borderRadius: 8,
        marginBottom: 6,
    },
    artistDiscoverText: {
        color: 'white',
        fontSize: 14,
    },
});
