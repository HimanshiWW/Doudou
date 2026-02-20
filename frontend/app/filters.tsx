import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../store/language';
import { useLocationsStore, Filters } from '../store/locations';

const { height } = Dimensions.get('window');

const LOCATION_TYPES = ['cafe', 'park', 'library', 'coworking', 'restaurant'];
const PRIVACY_LEVELS = ['private', 'semi-private', 'public'];

export default function FiltersScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();
  const { filters, setFilters, clearFilters, fetchLocations } = useLocationsStore();

  const [localFilters, setLocalFilters] = useState<Filters>({ ...filters });

  const handleTypeSelect = (type: string) => {
    setLocalFilters(prev => ({
      ...prev,
      location_type: prev.location_type === type ? undefined : type,
    }));
  };

  const handlePrivacySelect = (level: string) => {
    setLocalFilters(prev => ({
      ...prev,
      privacy_level: prev.privacy_level === level ? undefined : level,
    }));
  };

  const handleApply = async () => {
    setFilters(localFilters);
    await fetchLocations();
    router.back();
  };

  const handleClearAll = () => {
    setLocalFilters({
      location_type: undefined,
      privacy_level: undefined,
      free_only: false,
      verified_only: false,
      distance_km: 5,
    });
  };

  const handleReset = () => {
    handleClearAll();
    clearFilters();
  };

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1}
        onPress={() => router.back()}
      />

      {/* Bottom Sheet */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('filterLocations')}</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>{t('clearAll')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Type Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('type').toUpperCase()}</Text>
            <View style={styles.chipsContainer}>
              {LOCATION_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    localFilters.location_type === type && styles.chipSelected
                  ]}
                  onPress={() => handleTypeSelect(type)}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.location_type === type && styles.chipTextSelected
                  ]}>
                    {t(type) || type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Privacy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('privacy').toUpperCase()}</Text>
            <View style={styles.chipsContainer}>
              {PRIVACY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.chip,
                    localFilters.privacy_level === level && styles.chipSelected
                  ]}
                  onPress={() => handlePrivacySelect(level)}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.privacy_level === level && styles.chipTextSelected
                  ]}>
                    {level === 'private' ? t('private') :
                     level === 'semi-private' ? t('semiPrivate') : t('public')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Toggles Section */}
          <View style={styles.togglesSection}>
            {/* Free Only */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>{t('freeOnly')}</Text>
                <Text style={styles.toggleHint}>{t('showFreeLocations')}</Text>
              </View>
              <Switch
                value={localFilters.free_only}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, free_only: value }))}
                trackColor={{ false: '#E2E8F0', true: 'rgba(238, 43, 108, 0.3)' }}
                thumbColor={localFilters.free_only ? '#ee2b6c' : '#FFFFFF'}
              />
            </View>

            {/* Verified Only */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>{t('verified')}</Text>
                <Text style={styles.toggleHint}>{t('verifiedByComm')}</Text>
              </View>
              <Switch
                value={localFilters.verified_only}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, verified_only: value }))}
                trackColor={{ false: '#E2E8F0', true: 'rgba(238, 43, 108, 0.3)' }}
                thumbColor={localFilters.verified_only ? '#ee2b6c' : '#FFFFFF'}
              />
            </View>
          </View>

          {/* Distance Section */}
          <View style={styles.section}>
            <View style={styles.distanceHeader}>
              <Text style={styles.sectionLabel}>{t('distance').toUpperCase()}</Text>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceValue}>
                  {localFilters.distance_km}km
                </Text>
              </View>
            </View>
            
            {/* Distance Options */}
            <View style={styles.distanceOptions}>
              {[1, 2, 3, 5, 10].map((km) => (
                <TouchableOpacity
                  key={km}
                  style={[
                    styles.distanceOption,
                    localFilters.distance_km === km && styles.distanceOptionSelected
                  ]}
                  onPress={() => setLocalFilters(prev => ({ ...prev, distance_km: km }))}
                >
                  <Text style={[
                    styles.distanceOptionText,
                    localFilters.distance_km === km && styles.distanceOptionTextSelected
                  ]}>
                    {km}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.applyBtn}
            onPress={handleApply}
          >
            <Text style={styles.applyBtnText}>{t('applyFilters')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.resetBtn}
            onPress={handleReset}
          >
            <Text style={styles.resetBtnText}>{t('reset')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ee2b6c',
  },
  content: {
    paddingHorizontal: 24,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: '#ee2b6c',
    shadowColor: '#ee2b6c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'capitalize',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  togglesSection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  toggleHint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  distanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceBadge: {
    backgroundColor: 'rgba(238, 43, 108, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  distanceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ee2b6c',
  },
  distanceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  distanceOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  distanceOptionSelected: {
    backgroundColor: '#ee2b6c',
  },
  distanceOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  distanceOptionTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  applyBtn: {
    backgroundColor: '#ee2b6c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ee2b6c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resetBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
