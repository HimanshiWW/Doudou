import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguageStore } from '../store/language';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useLanguageStore();
  const [progressWidth] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressWidth, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Auto navigate after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)/explore');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    setLanguage(lang);
  };

  const handleSkip = () => {
    router.replace('/(tabs)/explore');
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
            <Text style={[styles.langText, language === 'en' && styles.langActive]}>
              EN
            </Text>
          </TouchableOpacity>
          <Text style={styles.langDivider}>|</Text>
          <TouchableOpacity 
            onPress={() => handleLanguageChange('fr')}
            style={styles.langButton}
          >
            <Text style={[styles.langText, language === 'fr' && styles.langActive]}>
              FR
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Illustration Circle */}
        <View style={styles.illustrationContainer}>
          <View style={styles.outerRing} />
          <View style={styles.middleRing} />
          <View style={styles.heroCircle}>
            <Ionicons name="heart" size={80} color="#ee2b6c" />
            <View style={styles.babyIcon}>
              <Ionicons name="happy" size={40} color="#ee2b6c" />
            </View>
          </View>
        </View>

        {/* Branding */}
        <View style={styles.branding}>
          <Text style={styles.brandTitle}>Doudou</Text>
          <Text style={styles.tagline}>
            {language === 'fr' ? 'Votre espace d\'allaitement' : 'Your breastfeeding safe-space'}
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
          {language === 'fr' ? 'Initialisation...' : 'Initializing...'}
        </Text>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>
            {language === 'fr' ? 'Passer' : 'Skip'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#ee2b6c" />
        </TouchableOpacity>
      </View>
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
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  langActive: {
    color: '#ee2b6c',
  },
  langDivider: {
    color: '#D1D5DB',
    marginHorizontal: 4,
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
    borderColor: 'rgba(252, 231, 243, 0.3)',
  },
  middleRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(252, 231, 243, 0.5)',
  },
  heroCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  babyIcon: {
    position: 'absolute',
    bottom: 50,
    right: 50,
  },
  branding: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  progressContainer: {
    width: 192,
    height: 4,
    backgroundColor: '#FCE7F3',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ee2b6c',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ee2b6c',
    marginRight: 4,
  },
});
