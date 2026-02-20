import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../src/store/language';
import { useLocationsStore } from '../../src/store/locations';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();
  const { savedLocations, isLoading, fetchSavedLocations, unsaveLocation } = useLocationsStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSavedLocations();
    setRefreshing(false);
  }, []);

  const handleRemove = async (locationId: string) => {
    await unsaveLocation(locationId);
  };

  const handlePress = (locationId: string) => {
    router.push(`/location/${locationId}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('saved')}</Text>
        <Text style={styles.subtitle}>
          {savedLocations.length} {savedLocations.length === 1 ? 'place' : 'places'}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#ee2b6c" style={styles.loader} />
        ) : savedLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="heart-outline" size={48} color="#ee2b6c" />
            </View>
            <Text style={styles.emptyTitle}>
              {t('saved')} {t('reviews').toLowerCase()} empty
            </Text>
            <Text style={styles.emptyText}>
              Save your favorite nursing-friendly locations to access them quickly.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Ionicons name="map-outline" size={20} color="#FFFFFF" />
              <Text style={styles.exploreBtnText}>{t('explore')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          savedLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.card}
              onPress={() => handlePress(location.id)}
            >
              <Image
                source={{ uri: 'https://images.pexels.com/photos/35204925/pexels-photo-35204925.jpeg?w=300' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {location.name}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(location.id)}
                  >
                    <Ionicons name="heart" size={20} color="#ee2b6c" />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardMeta}>
                  <Ionicons name="location-outline" size={14} color="#64748B" />
                  <Text style={styles.cardAddress} numberOfLines={1}>
                    {location.address}
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>
                      {location.average_rating.toFixed(1)}
                    </Text>
                    <Text style={styles.reviewCount}>
                      ({location.total_reviews})
                    </Text>
                  </View>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>
                      {location.location_type}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(238, 43, 108, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ee2b6c',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  exploreBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F1F5F9',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 12,
  },
  removeBtn: {
    padding: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  cardAddress: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(238, 43, 108, 0.1)',
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ee2b6c',
    textTransform: 'capitalize',
  },
});
