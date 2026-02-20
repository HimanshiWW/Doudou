import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguageStore } from '../src/store/language';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useLanguageStore();
  const [progressWidth] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLocationConsent, setShowLocationConsent] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    checkFirstLaunch();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressWidth, {
      toValue: 100,
      duration: 4000,
      useNativeDriver: false,
    }).start();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('doudou_first_launch');
      const locationConsent = await AsyncStorage.getItem('doudou_location_consent');
      
      if (!hasLaunched) {
        // First launch - show privacy notice
        setTimeout(() => setShowPrivacyModal(true), 1500);
      } else if (!locationConsent) {
        // Haven't asked for location consent yet
        setTimeout(() => setShowLocationConsent(true), 1500);
      } else {
        setHasConsented(true);
        // Auto navigate after animation completes
        setTimeout(() => {
          router.replace('/(tabs)/explore');
        }, 4500);
      }
    } catch (error) {
      console.log('Error checking first launch:', error);
    }
  };

  const handleAcceptPrivacy = async () => {
    await AsyncStorage.setItem('doudou_first_launch', 'true');
    setShowPrivacyModal(false);
    setShowLocationConsent(true);
  };

  const handleLocationConsent = async (granted: boolean) => {
    if (granted) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        await AsyncStorage.setItem('doudou_location_consent', status === 'granted' ? 'granted' : 'denied');
      } catch (error) {
        console.log('Error requesting location:', error);
        await AsyncStorage.setItem('doudou_location_consent', 'denied');
      }
    } else {
      await AsyncStorage.setItem('doudou_location_consent', 'denied');
    }
    
    setShowLocationConsent(false);
    setHasConsented(true);
    
    // Navigate to main app
    setTimeout(() => {
      router.replace('/(tabs)/explore');
    }, 500);
  };

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    setLanguage(lang);
  };

  const handleSkip = () => {
    if (!hasConsented) {
      setShowLocationConsent(true);
    } else {
      router.replace('/(tabs)/explore');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Language Toggle */}
      <View style={styles.header}>
        <View style={styles.languageToggle}>
          <TouchableOpacity 
            onPress={() => handleLanguageChange('en')}
            style={styles.langButton}
          >
            <Text style={[styles.langText, language === 'en' && styles.langActiveEN]}>
              EN
            </Text>
          </TouchableOpacity>
          <Text style={styles.langDivider}>|</Text>
          <TouchableOpacity 
            onPress={() => handleLanguageChange('fr')}
            style={styles.langButton}
          >
            <Text style={[styles.langText, language === 'fr' && styles.langActiveFR]}>
              FR
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Illustration Circle with Halo Effect */}
        <View style={styles.illustrationContainer}>
          {/* Outer halo rings */}
          <View style={styles.outerRing} />
          <View style={styles.middleRing} />
          
          {/* Main illustration circle */}
          <View style={styles.heroCircle}>
            {/* Mother and baby illustration using SVG-like elements */}
            <View style={styles.illustrationWrapper}>
              {/* Mother's hair */}
              <View style={styles.motherHair} />
              <View style={styles.motherHairWave} />
              
              {/* Mother's face */}
              <View style={styles.motherFace}>
                <View style={styles.motherEye} />
                <View style={styles.motherSmile} />
              </View>
              
              {/* Mother's body/clothing */}
              <View style={styles.motherBody}>
                {/* Baby */}
                <View style={styles.baby}>
                  <View style={styles.babyHead} />
                  <View style={styles.babyBody} />
                </View>
              </View>
              
              {/* Mother's arm */}
              <View style={styles.motherArm} />
            </View>
          </View>
        </View>

        {/* Branding */}
        <View style={styles.branding}>
          <Text style={styles.brandTitle}>Doudou</Text>
          <Text style={styles.tagline}>
            {language === 'fr' ? 'VOTRE ESPACE D\'ALLAITEMENT' : 'YOUR BREASTFEEDING SPACE'}
          </Text>
        </View>
      </Animated.View>

      {/* Footer with Progress */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]} 
          />
        </View>
        <Text style={styles.loadingText}>
          {language === 'fr' ? 'INITIALISATION...' : 'INITIALIZING...'}
        </Text>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>
            {language === 'fr' ? 'Passer' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
            </Text>
            
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>
                {language === 'fr' ? (
                  `Bienvenue sur Doudou!

Nous respectons votre vie privée et nous engageons à protéger vos données personnelles.

📍 Données de localisation
Nous utilisons votre position pour vous montrer les espaces d'allaitement à proximité. Ces données ne sont jamais partagées avec des tiers.

📝 Avis et commentaires
Les avis que vous laissez sont publics mais peuvent être anonymes.

🔒 Stockage des données
Vos préférences sont stockées localement sur votre appareil.

💳 Aucune collecte financière
Nous ne collectons aucune information de paiement.

En utilisant Doudou, vous acceptez ces conditions.`
                ) : (
                  `Welcome to Doudou!

We respect your privacy and are committed to protecting your personal data.

📍 Location Data
We use your location to show you nearby breastfeeding-friendly spaces. This data is never shared with third parties.

📝 Reviews & Comments
Reviews you leave are public but can be anonymous.

🔒 Data Storage
Your preferences are stored locally on your device.

💳 No Financial Collection
We do not collect any payment information.

By using Doudou, you agree to these terms.`
                )}
              </Text>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleAcceptPrivacy}
            >
              <Text style={styles.modalButtonText}>
                {language === 'fr' ? 'J\'accepte' : 'I Accept'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Consent Modal */}
      <Modal
        visible={showLocationConsent}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.locationIconContainer}>
              <Text style={styles.locationIcon}>📍</Text>
            </View>
            
            <Text style={styles.modalTitle}>
              {language === 'fr' ? 'Autoriser la localisation?' : 'Allow Location Access?'}
            </Text>
            
            <Text style={styles.locationDescription}>
              {language === 'fr' ? (
                'Doudou utilise votre position pour trouver les espaces d\'allaitement les plus proches de vous.\n\nVos données de localisation restent sur votre appareil et ne sont jamais partagées.'
              ) : (
                'Doudou uses your location to find the nearest breastfeeding-friendly spaces near you.\n\nYour location data stays on your device and is never shared.'
              )}
            </Text>
            
            <View style={styles.consentButtons}>
              <TouchableOpacity 
                style={[styles.consentButton, styles.consentButtonSecondary]}
                onPress={() => handleLocationConsent(false)}
              >
                <Text style={styles.consentButtonSecondaryText}>
                  {language === 'fr' ? 'Plus tard' : 'Not Now'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.consentButton, styles.consentButtonPrimary]}
                onPress={() => handleLocationConsent(true)}
              >
                <Text style={styles.consentButtonPrimaryText}>
                  {language === 'fr' ? 'Autoriser' : 'Allow'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95A5A6',
    letterSpacing: 0.5,
  },
  langActiveEN: {
    color: '#E74C3C',
  },
  langActiveFR: {
    color: '#E74C3C',
  },
  langDivider: {
    color: '#BDC3C7',
    marginHorizontal: 4,
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    position: 'relative',
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  outerRing: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(254, 235, 247, 0.5)',
  },
  middleRing: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 1,
    borderColor: 'rgba(254, 235, 247, 0.7)',
  },
  heroCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FEEBF7',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  illustrationWrapper: {
    width: 180,
    height: 180,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Simplified illustration using basic shapes
  motherHair: {
    position: 'absolute',
    top: 0,
    width: 90,
    height: 100,
    backgroundColor: '#9B5941',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  motherHairWave: {
    position: 'absolute',
    top: 40,
    right: 25,
    width: 50,
    height: 80,
    backgroundColor: '#9B5941',
    borderBottomRightRadius: 25,
    transform: [{ rotate: '-15deg' }],
  },
  motherFace: {
    position: 'absolute',
    top: 25,
    width: 60,
    height: 50,
    backgroundColor: '#F5D2C2',
    borderRadius: 30,
    alignItems: 'center',
  },
  motherEye: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 8,
    height: 2,
    backgroundColor: '#2C3E50',
    borderRadius: 1,
  },
  motherSmile: {
    position: 'absolute',
    top: 30,
    width: 12,
    height: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#D4A99A',
    borderRadius: 6,
  },
  motherBody: {
    position: 'absolute',
    top: 70,
    width: 100,
    height: 90,
    backgroundColor: '#7AB5A5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    paddingTop: 15,
  },
  baby: {
    position: 'relative',
    width: 60,
    height: 50,
  },
  babyHead: {
    position: 'absolute',
    top: 0,
    left: 5,
    width: 30,
    height: 28,
    backgroundColor: '#F5D2C2',
    borderRadius: 14,
  },
  babyBody: {
    position: 'absolute',
    top: 20,
    left: 0,
    width: 50,
    height: 35,
    backgroundColor: '#8CC4B5',
    borderRadius: 15,
  },
  motherArm: {
    position: 'absolute',
    top: 90,
    left: 20,
    width: 40,
    height: 50,
    backgroundColor: '#F5D2C2',
    borderRadius: 20,
    transform: [{ rotate: '30deg' }],
  },
  branding: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 52,
    fontWeight: '700',
    color: '#2C3E50',
    letterSpacing: -1,
    fontFamily: 'System',
  },
  tagline: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7F8C8D',
    letterSpacing: 3,
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  progressContainer: {
    width: 200,
    height: 4,
    backgroundColor: '#FEEBF7',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F55A9F',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#7F8C8D',
    letterSpacing: 2,
    marginBottom: 20,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F55A9F',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  modalButton: {
    backgroundColor: '#F55A9F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Location consent
  locationIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 48,
  },
  locationDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
  },
  consentButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  consentButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  consentButtonSecondary: {
    backgroundColor: '#F1F5F9',
  },
  consentButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  consentButtonPrimary: {
    backgroundColor: '#F55A9F',
  },
  consentButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
