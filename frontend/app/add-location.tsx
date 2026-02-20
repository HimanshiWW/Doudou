import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../src/store/language';
import { useLocationsStore } from '../src/store/locations';
import * as Location from 'expo-location';

const LOCATION_TYPES = ['cafe', 'restaurant', 'park', 'library', 'coworking', 'other'];
const PRIVACY_LEVELS = ['private', 'semi-private', 'public'];

export default function AddLocationScreen() {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguageStore();
  const { addLocation, isLoading } = useLocationsStore();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 48.8566,
    longitude: 2.3522,
    location_type: '',
    privacy_level: 'private',
    requires_purchase: false,
    description: '',
    amenities: [] as string[],
    photos: [] as string[],
  });

  const [addressSearch, setAddressSearch] = useState('');

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please enable location permissions');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setFormData(prev => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));

      // Try to reverse geocode
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        const addressString = `${address.street || ''} ${address.streetNumber || ''}, ${address.city || ''} ${address.postalCode || ''}`;
        setFormData(prev => ({ ...prev, address: addressString.trim() }));
        setAddressSearch(addressString.trim());
      }
    } catch (error) {
      Alert.alert('Error', 'Could not get current location');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a location name');
      return;
    }
    if (!formData.location_type) {
      Alert.alert('Error', 'Please select a location type');
      return;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return;
    }

    const success = await addLocation(formData);
    if (success) {
      Alert.alert(
        language === 'fr' ? 'Succès' : 'Success',
        t('locationAdded'),
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('Error', 'Failed to add location. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addLocation')}</Text>
        <TouchableOpacity 
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Address Search */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('findAddress')}</Text>
          <View style={styles.searchInput}>
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput
              style={styles.input}
              placeholder={t('searchAddress')}
              placeholderTextColor="#94A3B8"
              value={addressSearch}
              onChangeText={(text) => {
                setAddressSearch(text);
                setFormData(prev => ({ ...prev, address: text }));
              }}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.currentLocationBtn}
            onPress={handleUseCurrentLocation}
          >
            <Ionicons name="locate" size={18} color="#ee2b6c" />
            <Text style={styles.currentLocationText}>{t('useCurrentLocation')}</Text>
          </TouchableOpacity>

          {/* Map Preview */}
          <View style={styles.mapPreview}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1593365092768-1ebb729fb66c?w=800' }}
              style={styles.mapImage}
            />
            <View style={styles.mapPin}>
              <Ionicons name="location" size={32} color="#ee2b6c" />
            </View>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('locationName')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., The Cozy Corner"
            placeholderTextColor="#94A3B8"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
        </View>

        {/* Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('type')}</Text>
          <View style={styles.typeGrid}>
            {LOCATION_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  formData.location_type === type && styles.typeOptionSelected
                ]}
                onPress={() => setFormData(prev => ({ ...prev, location_type: type }))}
              >
                <Ionicons 
                  name={
                    type === 'cafe' ? 'cafe' :
                    type === 'restaurant' ? 'restaurant' :
                    type === 'park' ? 'leaf' :
                    type === 'library' ? 'library' :
                    type === 'coworking' ? 'laptop' : 'location'
                  }
                  size={20} 
                  color={formData.location_type === type ? '#ee2b6c' : '#94A3B8'} 
                />
                <Text style={[
                  styles.typeText,
                  formData.location_type === type && styles.typeTextSelected
                ]}>
                  {t(type) || type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy Level */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('privacyLevelLabel')}</Text>
          <View style={styles.privacyGrid}>
            {PRIVACY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.privacyOption,
                  formData.privacy_level === level && styles.privacyOptionSelected
                ]}
                onPress={() => setFormData(prev => ({ ...prev, privacy_level: level }))}
              >
                <Ionicons 
                  name={
                    level === 'private' ? 'lock-closed' :
                    level === 'semi-private' ? 'people' : 'earth'
                  }
                  size={18} 
                  color={formData.privacy_level === level ? '#ee2b6c' : '#94A3B8'} 
                />
                <Text style={[
                  styles.privacyText,
                  formData.privacy_level === level && styles.privacyTextSelected
                ]}>
                  {level === 'private' ? t('private') : 
                   level === 'semi-private' ? t('semiPrivate') : t('public')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Purchase Toggle */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>{t('requiresPurchase')}</Text>
            <Text style={styles.toggleHint}>{t('purchaseHint')}</Text>
          </View>
          <Switch
            value={formData.requires_purchase}
            onValueChange={(value) => setFormData(prev => ({ ...prev, requires_purchase: value }))}
            trackColor={{ false: '#E2E8F0', true: 'rgba(238, 43, 108, 0.3)' }}
            thumbColor={formData.requires_purchase ? '#ee2b6c' : '#FFFFFF'}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('addNote')}</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={t('shareExtraTips')}
            placeholderTextColor="#94A3B8"
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('photos')}</Text>
          <TouchableOpacity style={styles.photoUpload}>
            <Ionicons name="camera" size={32} color="#ee2b6c" />
            <Text style={styles.photoUploadText}>{t('tapToUpload')}</Text>
            <Text style={styles.photoUploadHint}>{t('maxFileSize')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity 
          style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitBtnText}>
            {isLoading ? 'Submitting...' : t('submitLocation')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  currentLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  currentLocationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ee2b6c',
  },
  mapPreview: {
    marginTop: 12,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -32,
    marginLeft: -16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
    paddingBottom: 14,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(238, 43, 108, 0.05)',
    borderColor: '#ee2b6c',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'capitalize',
  },
  typeTextSelected: {
    color: '#ee2b6c',
  },
  privacyGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  privacyOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  privacyOptionSelected: {
    backgroundColor: 'rgba(238, 43, 108, 0.05)',
    borderColor: '#ee2b6c',
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  privacyTextSelected: {
    color: '#ee2b6c',
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 24,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  toggleHint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  photoUpload: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  photoUploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 8,
  },
  photoUploadHint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitBtn: {
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
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});
