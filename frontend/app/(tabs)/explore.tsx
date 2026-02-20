import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../src/store/language';
import { useLocationsStore, Location } from '../../src/store/locations';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { t, language, setLanguage } = useLanguageStore();
  const { locations, isLoading, fetchLocations, seedData } = useLocationsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchLocations();
    // If no locations, seed the database
    if (locations.length === 0) {
      await seedData();
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLocations();
    setRefreshing(false);
  }, []);

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationPress = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleViewDetails = (locationId: string) => {
    router.push(`/location/${locationId}`);
  };

  const getLocationTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      cafe: t('cafe'),
      restaurant: t('restaurant'),
      park: t('park'),
      library: t('library'),
      coworking: t('coworking'),
    };
    return types[type] || type;
  };

  const getPrivacyLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      private: t('private'),
      'semi-private': t('semiPrivate'),
      public: t('public'),
    };
    return levels[level] || level;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>DOUDOU</Text>
        <View style={styles.headerRight}>
          {/* Language Toggle */}
          <View style={styles.langToggle}>
            <TouchableOpacity onPress={() => setLanguage('en')}>
              <Text style={[styles.langText, language === 'en' && styles.langActive]}>EN</Text>
            </TouchableOpacity>
            <Text style={styles.langDivider}>|</Text>
            <TouchableOpacity onPress={() => setLanguage('fr')}>
              <Text style={[styles.langText, language === 'fr' && styles.langActive]}>FR</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#ee2b6c" />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#ee2b6c" />
          </View>
        </View>
      </View>

      {/* Map View (Simulated) */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1593365092768-1ebb729fb66c?w=800' }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchPlaceholder')}
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterBtn}
            onPress={() => router.push('/filters')}
          >
            <Ionicons name="options" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Map Pins (Simulated) */}
        <View style={styles.pinsContainer}>
          {/* Current Location */}
          <View style={[styles.currentLocationPin, { top: '50%', left: '30%' }]}>
            <View style={styles.currentLocationOuter} />
            <View style={styles.currentLocationInner} />
          </View>

          {/* Location Pins */}
          {filteredLocations.slice(0, 4).map((loc, index) => {
            const positions = [
              { top: '45%', left: '50%' },
              { top: '30%', right: '25%' },
              { top: '55%', left: '15%' },
              { top: '35%', left: '40%' },
            ];
            const pos = positions[index];
            const isSelected = selectedLocation?.id === loc.id;

            return (
              <TouchableOpacity
                key={loc.id}
                style={[styles.locationPin, pos, isSelected && styles.selectedPin]}
                onPress={() => handleLocationPress(loc)}
              >
                <Ionicons 
                  name="heart" 
                  size={isSelected ? 24 : 18} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapControlBtn}>
            <Ionicons name="locate" size={20} color="#475569" />
          </TouchableOpacity>
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomBtn}>
              <Ionicons name="add" size={20} color="#475569" />
            </TouchableOpacity>
            <View style={styles.zoomDivider} />
            <TouchableOpacity style={styles.zoomBtn}>
              <Ionicons name="remove" size={20} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Location Preview Card */}
      {selectedLocation ? (
        <View style={styles.previewCard}>
          <View style={styles.previewContent}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/35204925/pexels-photo-35204925.jpeg?w=300' }}
              style={styles.previewImage}
            />
            <View style={styles.previewInfo}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewName} numberOfLines={1}>
                  {selectedLocation.name}
                </Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>
                    {selectedLocation.average_rating.toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.previewMeta}>
                250m {t('away')} • {t('openUntil')} 7 PM
              </Text>
              <View style={styles.tagContainer}>
                <View style={[styles.tag, styles.tagPrimary]}>
                  <Text style={styles.tagTextPrimary}>
                    {getLocationTypeLabel(selectedLocation.location_type)}
                  </Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {getPrivacyLabel(selectedLocation.privacy_level)}
                  </Text>
                </View>
                {selectedLocation.amenities.slice(0, 1).map((amenity, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>
                      {amenity.replace('_', ' ')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.previewFooter}>
            <Text style={styles.reviewCount}>
              {selectedLocation.total_reviews} {t('reviews')}
            </Text>
            <TouchableOpacity 
              style={styles.viewDetailsBtn}
              onPress={() => handleViewDetails(selectedLocation.id)}
            >
              <Text style={styles.viewDetailsText}>{t('viewDetails')}</Text>
              <Ionicons name="arrow-forward" size={16} color="#ee2b6c" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          style={styles.locationsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#ee2b6c" style={styles.loader} />
          ) : (
            filteredLocations.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={styles.listCard}
                onPress={() => handleViewDetails(loc.id)}
              >
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/35204925/pexels-photo-35204925.jpeg?w=200' }}
                  style={styles.listImage}
                />
                <View style={styles.listInfo}>
                  <Text style={styles.listName} numberOfLines={1}>{loc.name}</Text>
                  <View style={styles.listMeta}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.listRating}>{loc.average_rating.toFixed(1)}</Text>
                    <Text style={styles.listReviews}>({loc.total_reviews})</Text>
                  </View>
                  <View style={[styles.tag, styles.tagSmall]}>
                    <Text style={styles.tagTextSmall}>
                      {getLocationTypeLabel(loc.location_type)}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ee2b6c',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    paddingHorizontal: 4,
  },
  langActive: {
    color: '#ee2b6c',
  },
  langDivider: {
    color: '#D1D5DB',
    marginHorizontal: 2,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(238, 43, 108, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(238, 43, 108, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(238, 43, 108, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  searchContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1E293B',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ee2b6c',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ee2b6c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pinsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  currentLocationPin: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationOuter: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  currentLocationInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  locationPin: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(238, 43, 108, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedPin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ee2b6c',
    borderWidth: 4,
    shadowColor: '#ee2b6c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '40%',
    gap: 8,
  },
  mapControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  zoomControls: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  zoomBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  previewCard: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  previewContent: {
    flexDirection: 'row',
    gap: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  previewInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
  tagPrimary: {
    backgroundColor: 'rgba(238, 43, 108, 0.1)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'capitalize',
  },
  tagTextPrimary: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ee2b6c',
  },
  tagSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagTextSmall: {
    fontSize: 9,
    fontWeight: '600',
    color: '#ee2b6c',
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginTop: 12,
  },
  reviewCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ee2b6c',
  },
  locationsList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loader: {
    marginTop: 20,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  listImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  listInfo: {
    flex: 1,
    marginLeft: 12,
  },
  listName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  listRating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  listReviews: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
