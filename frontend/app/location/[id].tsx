import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../../store/language';
import { useLocationsStore, Review } from '../../store/locations';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();
  const { 
    currentLocation, 
    reviews, 
    isLoading, 
    fetchLocationById, 
    fetchReviews,
    saveLocation,
    unsaveLocation,
    checkIfSaved
  } = useLocationsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (id) {
      await fetchLocationById(id);
      await fetchReviews(id);
      const saved = await checkIfSaved(id);
      setIsSaved(saved);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    
    if (isSaved) {
      await unsaveLocation(id);
      setIsSaved(false);
    } else {
      await saveLocation(id);
      setIsSaved(true);
    }
  };

  const handleGetDirections = () => {
    if (!currentLocation) return;
    
    const { latitude, longitude, name } = currentLocation;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}&q=${encodeURIComponent(name)}`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });
    
    Linking.openURL(url);
  };

  const handleAddReview = () => {
    router.push({
      pathname: '/add-review',
      params: { locationId: id, locationName: currentLocation?.name },
    });
  };

  const getRatingPercentage = (rating: number) => {
    return (rating / 5) * 100;
  };

  const calculateCategoryRatings = () => {
    if (reviews.length === 0) return { staff: 0, comfort: 0, privacy: 0, safety: 0, wouldReturn: 0 };
    
    const totals = reviews.reduce(
      (acc, review) => ({
        staff: acc.staff + review.staff_rating,
        comfort: acc.comfort + review.comfort_rating,
        privacy: acc.privacy + review.privacy_rating,
        safety: acc.safety + review.safety_rating,
        wouldReturn: acc.wouldReturn + (review.would_return ? 1 : 0),
      }),
      { staff: 0, comfort: 0, privacy: 0, safety: 0, wouldReturn: 0 }
    );
    
    const count = reviews.length;
    return {
      staff: totals.staff / count,
      comfort: totals.comfort / count,
      privacy: totals.privacy / count,
      safety: totals.safety / count,
      wouldReturn: Math.round((totals.wouldReturn / count) * 100),
    };
  };

  if (isLoading || !currentLocation) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#ee2b6c" />
      </View>
    );
  }

  const categoryRatings = calculateCategoryRatings();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/34711923/pexels-photo-34711923.jpeg?w=800' }}
            style={styles.headerImage}
          />
          
          {/* Navigation */}
          <View style={[styles.navigation, { top: insets.top + 16 }]}>
            <TouchableOpacity 
              style={styles.navBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.navRight}>
              <TouchableOpacity style={styles.navBtn} onPress={handleSave}>
                <Ionicons 
                  name={isSaved ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isSaved ? "#ee2b6c" : "#0F172A"} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}>
                <Ionicons name="share-outline" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{currentLocation.name}</Text>
            <View style={styles.addressRow}>
              <Ionicons name="location" size={18} color="#ee2b6c" />
              <Text style={styles.address}>{currentLocation.address}</Text>
            </View>
            
            {/* Tags */}
            <View style={styles.tagRow}>
              <View style={[styles.tag, styles.tagPrimary]}>
                <Text style={styles.tagTextPrimary}>
                  {currentLocation.location_type}
                </Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  {currentLocation.privacy_level}
                </Text>
              </View>
              {currentLocation.requires_purchase && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Purchase required</Text>
                </View>
              )}
            </View>
          </View>

          {/* Directions Button */}
          <TouchableOpacity 
            style={styles.directionsBtn}
            onPress={handleGetDirections}
          >
            <Ionicons name="navigate" size={20} color="#FFFFFF" />
            <Text style={styles.directionsBtnText}>{t('getDirections')}</Text>
          </TouchableOpacity>

          {/* Ratings Section */}
          <View style={styles.ratingsSection}>
            <View style={styles.overallRating}>
              <Text style={styles.ratingNumber}>
                {currentLocation.average_rating.toFixed(1)}
              </Text>
              <View style={styles.ratingMeta}>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= Math.round(currentLocation.average_rating) ? "star" : "star-outline"}
                      size={18}
                      color="#ee2b6c"
                    />
                  ))}
                </View>
                <Text style={styles.reviewCountText}>
                  {currentLocation.total_reviews} {t('localMomsReviewed')}
                </Text>
              </View>
            </View>

            {/* Rating Bars */}
            <View style={styles.ratingBars}>
              <RatingBar 
                label={t('staffFriendliness')} 
                value={categoryRatings.staff} 
              />
              <RatingBar 
                label={t('comfortSeating')} 
                value={categoryRatings.comfort} 
              />
              <RatingBar 
                label={t('privacyLevel')} 
                value={categoryRatings.privacy} 
              />
              <RatingBar 
                label={t('safetyRating')} 
                value={categoryRatings.safety} 
              />
              
              <View style={styles.wouldReturnRow}>
                <Text style={styles.wouldReturnLabel}>{t('wouldReturn')}</Text>
                <Text style={styles.wouldReturnValue}>{categoryRatings.wouldReturn}%</Text>
              </View>
            </View>
          </View>

          {/* Photo Gallery */}
          <View style={styles.gallerySection}>
            <Text style={styles.sectionTitle}>{t('userPhotos')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.galleryRow}>
                {['https://images.pexels.com/photos/35204925/pexels-photo-35204925.jpeg?w=300',
                  'https://images.pexels.com/photos/34711923/pexels-photo-34711923.jpeg?w=300',
                  'https://images.pexels.com/photos/3845200/pexels-photo-3845200.jpeg?w=300'
                ].map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={styles.galleryImage}
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('reviews')}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>{t('seeAll')}</Text>
              </TouchableOpacity>
            </View>

            {reviews.length === 0 ? (
              <View style={styles.noReviews}>
                <Text style={styles.noReviewsText}>No reviews yet. Be the first!</Text>
              </View>
            ) : (
              reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} t={t} />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity 
          style={styles.addReviewBtn}
          onPress={handleAddReview}
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addReviewBtnText}>{t('addReview')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.ratingBarContainer}>
      <View style={styles.ratingBarHeader}>
        <Text style={styles.ratingBarLabel}>{label}</Text>
        <Text style={styles.ratingBarValue}>{value.toFixed(1)}</Text>
      </View>
      <View style={styles.ratingBarTrack}>
        <View 
          style={[
            styles.ratingBarFill, 
            { width: `${(value / 5) * 100}%` }
          ]} 
        />
      </View>
    </View>
  );
}

function ReviewCard({ review, t }: { review: Review; t: (key: string) => string }) {
  const getInitials = (name?: string) => {
    if (!name) return 'AN';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <View style={styles.reviewerAvatar}>
            <Text style={styles.reviewerInitials}>
              {getInitials(review.reviewer_name)}
            </Text>
          </View>
          <View>
            <Text style={styles.reviewerName}>
              {review.anonymous ? 'Anonymous' : review.reviewer_name || 'User'}
            </Text>
            <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
          </View>
        </View>
        <View style={styles.reviewStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.round(review.overall_rating) ? "star" : "star-outline"}
              size={14}
              color="#ee2b6c"
            />
          ))}
        </View>
      </View>
      
      {review.comment && (
        <Text style={styles.reviewComment}>{review.comment}</Text>
      )}
      
      <TouchableOpacity style={styles.helpfulBtn}>
        <Ionicons name="thumbs-up-outline" size={16} color="#ee2b6c" />
        <Text style={styles.helpfulText}>
          {t('helpful')} ({review.helpful_count})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F6F6',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  navigation: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRight: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  address: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  tagPrimary: {
    backgroundColor: 'rgba(238, 43, 108, 0.1)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'capitalize',
  },
  tagTextPrimary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ee2b6c',
    textTransform: 'capitalize',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ee2b6c',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#ee2b6c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  directionsBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ratingsSection: {
    marginBottom: 24,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 20,
  },
  ratingNumber: {
    fontSize: 40,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 44,
  },
  ratingMeta: {
    paddingBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewCountText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  ratingBars: {
    gap: 16,
  },
  ratingBarContainer: {
    gap: 6,
  },
  ratingBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  ratingBarValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  ratingBarTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#ee2b6c',
    borderRadius: 4,
  },
  wouldReturnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  wouldReturnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  wouldReturnValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ee2b6c',
  },
  gallerySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  galleryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  galleryImage: {
    width: 128,
    height: 128,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  reviewsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ee2b6c',
  },
  noReviews: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#64748B',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(238, 43, 108, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ee2b6c',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewComment: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(238, 43, 108, 0.2)',
    borderRadius: 20,
  },
  helpfulText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ee2b6c',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ee2b6c',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#ee2b6c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addReviewBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
