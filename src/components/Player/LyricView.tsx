import React, { useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { Lyric } from '../../types/player.d';

type LyricViewProps = {
  lyrics: Lyric[];
  currentIndex: number;
};

export const LyricView = ({ lyrics, currentIndex }: LyricViewProps) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (currentIndex > -1) {
      const offset = currentIndex * 40; // Giả sử mỗi dòng cao 40
      scrollRef.current?.scrollTo({
        y: offset - 100, // Cuộn trước 100px để lyric hiện ở giữa
        animated: true
      });
    }
  }, [currentIndex]);

  return (
    <ScrollView 
      ref={scrollRef} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {lyrics.map((lyric, index) => (
        <Text 
          key={index}
          style={[
            styles.line,
            index === currentIndex && styles.activeLine
          ]}
        >
          {lyric.text}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  line: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 8,
  },
  activeLine: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});