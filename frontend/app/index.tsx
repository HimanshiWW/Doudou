import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguageStore } from '../src/store/language';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MotherBabyIllustration from '../src/components/MotherBabyIllustration';

const { width } = Dimensions.get('window');

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

    // Progress bar animation - smoother
    Animated.timing(progressWidth, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }).start();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('doudou_first_launch');
      const locationConsent = await AsyncStorage.getItem('doudou_location_consent');
      
      if (!hasLaunched) {
        setTimeout(() => setShowPrivacyModal(true), 4000);
      } else if (!locationConsent) {
        setTimeout(() => setShowLocationConsent(true), 4000);
      } else {
        setHasConsented(true);
        setTimeout(() => {
          router.replace('/(tabs)/explore');
        }, 5500);
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

  const circleSize = Math.min(width * 0.75, 320);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Language Toggle - Top Right */}
      <View style={styles.topBar}>
        <View style={styles.languageToggle}>
          <TouchableOpacity onPress={() => handleLanguageChange('en')}>
            <Text style={[styles.langText, language === 'en' && styles.langActive]}>EN</Text>
          </TouchableOpacity>
          <Text style={styles.langSep}>|</Text>
          <TouchableOpacity onPress={() => handleLanguageChange('fr')}>
            <Text style={[styles.langText, language === 'fr' && styles.langActive]}>FR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Pink Rings Container */}
        <View style={[styles.ringsContainer, { width: circleSize, height: circleSize }]}>
          {/* Outer ring */}
          <View style={[styles.ringOuter, { width: circleSize * 1.15, height: circleSize * 1.15 }]} />
          {/* Middle ring */}
          <View style={[styles.ringMiddle, { width: circleSize * 1.05, height: circleSize * 1.05 }]} />
          {/* Inner thick ring */}
          <View style={[styles.ringInner, { width: circleSize * 0.92, height: circleSize * 0.92 }]} />
          
          {/* White card with illustration */}
          <View style={[styles.illustrationCard, { width: circleSize * 0.72, height: circleSize * 0.72 }]}>
            <MotherBabyIllustration size={circleSize * 0.65} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Doudou</Text>
        <Text style={styles.subtitle}>
          {language === 'fr' ? 'VOTRE ESPACE D\'ALLAITEMENT' : 'YOUR BREASTFEEDING SPACE'}
        </Text>
      </Animated.View>

      {/* Bottom - Progress Bar */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.progressTrack}>
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
        <Text style={styles.initText}>
          {language === 'fr' ? 'INITIALISATION...' : 'INITIALIZING...'}
        </Text>
      </View>

      {/* Privacy Policy Modal */}
      <Modal visible={showPrivacyModal} transparent animationType="fade">
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
            
            <TouchableOpacity style={styles.modalButton} onPress={handleAcceptPrivacy}>
              <Text style={styles.modalButtonText}>
                {language === 'fr' ? 'J\'accepte' : 'I Accept'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Consent Modal */}
      <Modal visible={showLocationConsent} transparent animationType="fade">
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 60,
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A8B1BD',
    letterSpacing: 0.8,
  },
  langActive: {
    color: '#FF2AA3',
  },
  langSep: {
    color: '#C7CDD6',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  ringsContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ringOuter: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: 'rgba(255, 42, 163, 0.08)',
  },
  ringMiddle: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: 'rgba(255, 42, 163, 0.10)',
  },
  ringInner: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 10,
    borderColor: 'rgba(255, 42, 163, 0.10)',
  },
  illustrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF2AA3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 64,
    fontWeight: '800',
    color: '#0C1B2E',
    letterSpacing: -1.5,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A97A6',
    letterSpacing: 2.5,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  bottom: {
    alignItems: 'center',
    gap: 14,
  },
  progressTrack: {
    width: Math.min(340, width * 0.78),
    height: 8,
    backgroundColor: '#F1F3F6',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF2AA3',
    borderRadius: 999,
  },
  initText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B0B8C4',
    letterSpacing: 3.5,
    textTransform: 'uppercase',
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
    color: '#0C1B2E',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalScroll: {
    maxHeight: 280,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  modalButton: {
    backgroundColor: '#FF2AA3',
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
    backgroundColor: '#FF2AA3',
  },
  consentButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
