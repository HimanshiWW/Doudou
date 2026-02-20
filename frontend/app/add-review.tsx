import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../src/store/language';
import { useLocationsStore } from '../src/store/locations';

const ISSUES = [
  { id: 'asked_leave', labelKey: 'askedToLeave' },
  { id: 'felt_ignored', labelKey: 'feltIgnored' },
  { id: 'hygiene', labelKey: 'hygieneConcerns' },
];

export default function AddReviewScreen() {
  const { locationId, locationName } = useLocalSearchParams<{ locationId: string; locationName: string }>();
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguageStore();
  const { addReview, isLoading } = useLocationsStore();

  const [formData, setFormData] = useState({
    staff_rating: 4,
    comfort_rating: 3,
    privacy_rating: 5,
    safety_rating: 4,
    would_return: true,
    comment: '',
    issues: [] as string[],
    photos: [] as string[],
    anonymous: false,
    reviewer_name: '',
  });

  const handleRatingChange = (category: string, rating: number) => {
    setFormData(prev => ({ ...prev, [category]: rating }));
  };

  const handleToggleIssue = (issueId: string) => {
    setFormData(prev => ({
      ...prev,
      issues: prev.issues.includes(issueId)
        ? prev.issues.filter(id => id !== issueId)
        : [...prev.issues, issueId],
    }));
  };

  const handleSubmit = async () => {
    if (!locationId) {
      Alert.alert('Error', 'Location ID is missing');
      return;
    }

    const reviewData = {
      location_id: locationId,
      staff_rating: formData.staff_rating,
      comfort_rating: formData.comfort_rating,
      privacy_rating: formData.privacy_rating,
      safety_rating: formData.safety_rating,
      would_return: formData.would_return,
      comment: formData.comment,
      issues: formData.issues,
      photos: formData.photos,
      anonymous: formData.anonymous,
      reviewer_name: formData.anonymous ? undefined : formData.reviewer_name || undefined,
    };

    const success = await addReview(reviewData);
    if (success) {
      Alert.alert(
        language === 'fr' ? 'Succès' : 'Success',
        t('reviewAdded'),
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  };

  const renderStars = (category: string, currentRating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingChange(category, star)}
          >
            <Ionicons
              name={star <= currentRating ? 'star' : 'star-outline'}
              size={24}
              color={star <= currentRating ? '#ee2b6c' : '#CBD5E1'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.closeBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>{t('addReviewTitle')}</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {locationName || 'Location'}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.draftsBtn}>{t('drafts')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ratings Section */}
        <View style={styles.ratingsSection}>
          {/* Staff Rating */}
          <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{t('staffAttitude')}</Text>
            {renderStars('staff_rating', formData.staff_rating)}
          </View>

          {/* Comfort Rating */}
          <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{t('comfort')}</Text>
            {renderStars('comfort_rating', formData.comfort_rating)}
          </View>

          {/* Privacy Rating */}
          <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{t('privacy')}</Text>
            {renderStars('privacy_rating', formData.privacy_rating)}
          </View>

          {/* Safety Rating */}
          <View style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{t('safety')}</Text>
            {renderStars('safety_rating', formData.safety_rating)}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Would Return Toggle */}
        <View style={styles.wouldReturnSection}>
          <Text style={styles.sectionTitle}>{t('wouldYouReturn')}</Text>
          <View style={styles.toggleButtons}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                formData.would_return && styles.toggleBtnActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, would_return: true }))}
            >
              <Text style={[
                styles.toggleBtnText,
                formData.would_return && styles.toggleBtnTextActive
              ]}>
                {t('yes')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                !formData.would_return && styles.toggleBtnActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, would_return: false }))}
            >
              <Text style={[
                styles.toggleBtnText,
                !formData.would_return && styles.toggleBtnTextActive
              ]}>
                {t('no')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Issues Section */}
        <View style={styles.issuesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('anyIssues')}</Text>
            <Ionicons name="flag" size={16} color="#ee2b6c" />
          </View>
          {ISSUES.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={styles.issueOption}
              onPress={() => handleToggleIssue(issue.id)}
            >
              <View style={[
                styles.checkbox,
                formData.issues.includes(issue.id) && styles.checkboxChecked
              ]}>
                {formData.issues.includes(issue.id) && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.issueText}>{t(issue.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment Section */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>{t('shareExperience')}</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder={t('howWasVisit')}
              placeholderTextColor="#94A3B8"
              value={formData.comment}
              onChangeText={(text) => setFormData(prev => ({ ...prev, comment: text }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>
              {formData.comment.length} / 500
            </Text>
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>{t('photos')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.photosRow}>
              <TouchableOpacity style={styles.addPhotoBtn}>
                <Ionicons name="camera" size={24} color="#94A3B8" />
                <Text style={styles.addPhotoBtnText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Name Input (if not anonymous) */}
        {!formData.anonymous && (
          <View style={styles.nameSection}>
            <Text style={styles.sectionTitle}>Your Name (Optional)</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
              value={formData.reviewer_name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, reviewer_name: text }))}
            />
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.anonymousToggle}
          onPress={() => setFormData(prev => ({ ...prev, anonymous: !prev.anonymous }))}
        >
          <View style={[
            styles.checkbox,
            styles.checkboxSmall,
            formData.anonymous && styles.checkboxChecked
          ]}>
            {formData.anonymous && (
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.anonymousText}>{t('postAnonymously')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitBtnText}>
            {isLoading ? 'Submitting...' : t('submitReview')}
          </Text>
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
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitles: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  draftsBtn: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ee2b6c',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  ratingsSection: {
    gap: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 24,
  },
  wouldReturnSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#ee2b6c',
  },
  issuesSection: {
    marginBottom: 24,
  },
  issueOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSmall: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#ee2b6c',
    borderColor: '#ee2b6c',
  },
  issueText: {
    fontSize: 14,
    color: '#475569',
  },
  commentSection: {
    marginBottom: 24,
  },
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  photosSection: {
    marginBottom: 24,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addPhotoBtn: {
    width: 96,
    height: 96,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  nameSection: {
    marginBottom: 24,
  },
  nameInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  anonymousText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
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
});
