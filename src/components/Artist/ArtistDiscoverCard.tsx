import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

interface ArtistDiscoverCardProps {
    artistName: string;
}

interface RelatedArtist {
    name: string;
    image: string;
}

const mockRelatedArtists: RelatedArtist[] = [
    { name: "Nghệ sĩ A", image: "https://picsum.photos/200" },
    { name: "Nghệ sĩ B", image: "https://picsum.photos/200" },
    { name: "Nghệ sĩ C", image: "https://picsum.photos/200" },
    { name: "Nghệ sĩ D", image: "https://picsum.photos/200" },
  ];

export const ArtistDiscoverCard: React.FC<ArtistDiscoverCardProps> = ({ artistName }) => {
    const [relatedArtists, setRelatedArtists] = useState<RelatedArtist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedArtists = async () => {
            try {
                const response = await fetch(`https://api.example.com/artist/related?name=${encodeURIComponent(artistName)}`);
                const data: { relatedArtists: RelatedArtist[] } = await response.json();
                setRelatedArtists(data.relatedArtists);
            } catch (error) {
                console.error('Error fetching related artists:', error);
                setRelatedArtists(mockRelatedArtists); 
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedArtists();
    }, [artistName]);

    if (loading) {
        return <ActivityIndicator color="white" />;
    }

    return (
        <View style={styles.artistDiscoverCard}>
            <Text style={styles.artistSectionTitle}>Khám phá {artistName}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistDiscoverScroll}>
                {relatedArtists.map((item, index) => (
                    <View key={index} style={styles.artistDiscoverItem}>
                        <Image source={{ uri: item.image }} style={styles.artistDiscoverImage} />
                        <Text style={styles.artistDiscoverText}>{item.name}</Text>
                    </View>
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
