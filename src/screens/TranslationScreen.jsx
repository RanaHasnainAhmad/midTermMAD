import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSurahTranslation } from '../hooks/useSurahTranslation';

const HeaderRow = () => (
  <View style={styles.headerRow}>
    <View style={styles.column}>
      <Text style={styles.headerText}>Translation</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.headerText}>Ayah</Text>
    </View>
  </View>
);

const TranslationRow = ({ item }) => (
  <View style={styles.translationBlock}>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.translationText}>
          {item.TranslationAbridged || item.Translation || '—'}
        </Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.ayahText}>{item.AyahTextQalam}</Text>
      </View>
    </View>
    <View style={styles.detailRow}>
      <Text style={styles.detailText}>{item.Tafseer}</Text>
    </View>
  </View>
);

const TranslationScreen = () => {
  const { translations, loadNextSurah } = useSurahTranslation(105); // Change Surah number as needed
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Load the last read Surah and Ayah from AsyncStorage
  useEffect(() => {
    const restoreLastRead = async () => {
      const saved = await AsyncStorage.getItem('lastRead');
      if (saved) {
        const { surah, ayahId } = JSON.parse(saved);

        // Scroll to the last read Ayah if it exists
        const index = translations.findIndex((item) => item.Id === ayahId);
        if (flatListRef.current && index !== -1) {
          flatListRef.current.scrollToIndex({ index, animated: true });
        }
      }
    };

    restoreLastRead();
  }, [translations]);

  const handleEndReached = () => {
    setLoading(true);
    loadNextSurah();
    setLoading(false);
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const currentItem = viewableItems[0].item;

      // Save the current Surah and Ayah to AsyncStorage
      AsyncStorage.setItem(
        'lastRead',
        JSON.stringify({
          surah: currentItem.SurahNumber,
          ayahId: currentItem.Id,
        })
      );
    }
  }).current;

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <FlatList
        ref={flatListRef}
        data={translations}
        keyExtractor={(item) => item.Id.toString()}
        renderItem={({ item }) => <TranslationRow item={item} />}
        ListHeaderComponent={HeaderRow}
        contentContainerStyle={styles.contentContainer}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  contentContainer: { padding: 16 },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },
  translationBlock: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 12,
  },
  row: { flexDirection: 'row' },
  column: { flex: 1, padding: 8 },
  ayahText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  translationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a9d8f',
  },
  detailRow: { marginTop: 10, paddingHorizontal: 8 },
  detailText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default TranslationScreen;
