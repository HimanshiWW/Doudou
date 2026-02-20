import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

const translations: Translations = {
  // Navigation
  explore: { en: 'Explore', fr: 'Explorer' },
  saved: { en: 'Saved', fr: 'Favoris' },
  add: { en: 'Add', fr: 'Ajouter' },
  
  // Splash
  tagline: { en: 'Your breastfeeding safe-space', fr: 'Votre espace d\'allaitement' },
  initializing: { en: 'Initializing...', fr: 'Initialisation...' },
  skip: { en: 'Skip', fr: 'Passer' },
  
  // Map/Explore
  searchPlaceholder: { en: 'Find a nursing-friendly spot...', fr: 'Trouver un espace allaitement...' },
  viewDetails: { en: 'View details', fr: 'Voir les détails' },
  reviews: { en: 'reviews', fr: 'avis' },
  away: { en: 'away', fr: 'de distance' },
  openUntil: { en: 'Open until', fr: 'Ouvert jusqu\'à' },
  
  // Location Types
  cafe: { en: 'Café', fr: 'Café' },
  restaurant: { en: 'Restaurant', fr: 'Restaurant' },
  park: { en: 'Park', fr: 'Parc' },
  library: { en: 'Library', fr: 'Bibliothèque' },
  coworking: { en: 'Co-working', fr: 'Co-working' },
  other: { en: 'Other', fr: 'Autre' },
  
  // Privacy Levels
  private: { en: 'Private', fr: 'Privé' },
  semiPrivate: { en: 'Semi-private', fr: 'Semi-privé' },
  public: { en: 'Public', fr: 'Public' },
  
  // Amenities
  privateRoom: { en: 'Private Room', fr: 'Salle privée' },
  changingTable: { en: 'Changing Table', fr: 'Table à langer' },
  highChairs: { en: 'High Chairs', fr: 'Chaises hautes' },
  quietArea: { en: 'Quiet Area', fr: 'Espace calme' },
  wifi: { en: 'WiFi', fr: 'WiFi' },
  
  // Location Detail
  getDirections: { en: 'Get Directions', fr: 'Itinéraire' },
  addReview: { en: 'Add Your Review', fr: 'Ajouter un avis' },
  userPhotos: { en: 'User Photos', fr: 'Photos des utilisateurs' },
  seeAll: { en: 'See All', fr: 'Voir tout' },
  helpful: { en: 'Helpful', fr: 'Utile' },
  wouldReturn: { en: 'Would Return', fr: 'Retournerait' },
  
  // Ratings
  staffFriendliness: { en: 'Staff Friendliness', fr: 'Amabilité du personnel' },
  comfortSeating: { en: 'Comfort & Seating', fr: 'Confort et sièges' },
  privacyLevel: { en: 'Privacy Level', fr: 'Niveau de confidentialité' },
  safetyRating: { en: 'Safety Rating', fr: 'Note de sécurité' },
  localMomsReviewed: { en: 'local moms reviewed', fr: 'mamans locales ont évalué' },
  
  // Add Location
  addLocation: { en: 'Add Location', fr: 'Ajouter un lieu' },
  findAddress: { en: 'Find Address', fr: 'Trouver l\'adresse' },
  searchAddress: { en: 'Search for an address', fr: 'Rechercher une adresse' },
  useCurrentLocation: { en: 'Use current location', fr: 'Utiliser la position actuelle' },
  locationName: { en: 'Location Name', fr: 'Nom du lieu' },
  type: { en: 'Type', fr: 'Type' },
  selectCategory: { en: 'Select category', fr: 'Sélectionner une catégorie' },
  privacyLevelLabel: { en: 'Privacy Level', fr: 'Niveau de confidentialité' },
  requiresPurchase: { en: 'Requires purchase?', fr: 'Achat requis?' },
  purchaseHint: { en: 'e.g., Coffee or entrance fee', fr: 'ex. Café ou entrée payante' },
  addNote: { en: 'Add a note', fr: 'Ajouter une note' },
  shareExtraTips: { en: 'Share any extra tips or details...', fr: 'Partagez des conseils ou détails...' },
  photos: { en: 'Photos', fr: 'Photos' },
  tapToUpload: { en: 'Tap to upload photos', fr: 'Appuyez pour télécharger des photos' },
  maxFileSize: { en: 'Max 5MB per file', fr: 'Max 5 Mo par fichier' },
  submitLocation: { en: 'Submit Location', fr: 'Soumettre le lieu' },
  cancel: { en: 'Cancel', fr: 'Annuler' },
  
  // Filters
  filterLocations: { en: 'Filter Locations', fr: 'Filtrer les lieux' },
  clearAll: { en: 'Clear all', fr: 'Tout effacer' },
  privacy: { en: 'Privacy', fr: 'Confidentialité' },
  freeOnly: { en: 'Free only', fr: 'Gratuit uniquement' },
  showFreeLocations: { en: 'Show locations with no entry fee', fr: 'Afficher les lieux sans frais d\'entrée' },
  verified: { en: 'Verified', fr: 'Vérifié' },
  verifiedByComm: { en: 'Locations verified by our community', fr: 'Lieux vérifiés par notre communauté' },
  distance: { en: 'Distance', fr: 'Distance' },
  applyFilters: { en: 'Apply Filters', fr: 'Appliquer les filtres' },
  reset: { en: 'Reset', fr: 'Réinitialiser' },
  
  // Add Review
  addReviewTitle: { en: 'Add Review', fr: 'Ajouter un avis' },
  drafts: { en: 'Drafts', fr: 'Brouillons' },
  staffAttitude: { en: 'Staff Attitude', fr: 'Attitude du personnel' },
  comfort: { en: 'Comfort', fr: 'Confort' },
  safety: { en: 'Safety', fr: 'Sécurité' },
  wouldYouReturn: { en: 'Would you return?', fr: 'Retourneriez-vous?' },
  yes: { en: 'Yes', fr: 'Oui' },
  no: { en: 'No', fr: 'Non' },
  anyIssues: { en: 'Any issues?', fr: 'Des problèmes?' },
  askedToLeave: { en: 'Asked to leave prematurely', fr: 'On m\'a demandé de partir trop tôt' },
  feltIgnored: { en: 'Felt ignored by staff', fr: 'Ignoré par le personnel' },
  hygieneConcerns: { en: 'Hygiene concerns', fr: 'Problèmes d\'hygiène' },
  shareExperience: { en: 'Share your experience', fr: 'Partagez votre expérience' },
  howWasVisit: { en: 'How was your visit?', fr: 'Comment était votre visite?' },
  postAnonymously: { en: 'Post review anonymously', fr: 'Publier anonymement' },
  submitReview: { en: 'Submit Review', fr: 'Soumettre l\'avis' },
  
  // Notifications
  notifications: { en: 'Notifications', fr: 'Notifications' },
  
  // Errors
  errorLoadingLocations: { en: 'Error loading locations', fr: 'Erreur de chargement des lieux' },
  locationNotFound: { en: 'Location not found', fr: 'Lieu non trouvé' },
  
  // Success messages
  locationAdded: { en: 'Location added successfully!', fr: 'Lieu ajouté avec succès!' },
  reviewAdded: { en: 'Review added successfully!', fr: 'Avis ajouté avec succès!' },
  locationSaved: { en: 'Location saved!', fr: 'Lieu sauvegardé!' },
  locationRemoved: { en: 'Location removed from saved', fr: 'Lieu retiré des favoris' },
};

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  loadLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: 'fr',
  
  setLanguage: async (lang: Language) => {
    set({ language: lang });
    await AsyncStorage.setItem('doudou_language', lang);
  },
  
  t: (key: string) => {
    const { language } = get();
    return translations[key]?.[language] || key;
  },
  
  loadLanguage: async () => {
    try {
      const savedLang = await AsyncStorage.getItem('doudou_language');
      if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
        set({ language: savedLang });
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  },
}));
