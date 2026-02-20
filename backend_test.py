#!/usr/bin/env python3
"""
Backend API Testing for Doudou Breastfeeding Location Finder
Tests all CRUD operations for locations, reviews, and saved locations
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://lactation-finder.preview.emergentagent.com/api"

class DoudouAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_location_id = None
        self.created_review_id = None
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })
        
    def test_seed_data(self):
        """Test seeding sample data"""
        try:
            response = self.session.post(f"{self.base_url}/seed")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Seed Data", True, f"Database seeded successfully. {data.get('locations_count', 0)} locations created")
                return True
            else:
                self.log_test("Seed Data", False, f"Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Seed Data", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_get_all_locations(self):
        """Test GET /api/locations"""
        try:
            response = self.session.get(f"{self.base_url}/locations")
            
            if response.status_code == 200:
                locations = response.json()
                if isinstance(locations, list) and len(locations) > 0:
                    self.log_test("Get All Locations", True, f"Retrieved {len(locations)} locations")
                    return locations
                else:
                    self.log_test("Get All Locations", False, "No locations returned or invalid format")
                    return []
            else:
                self.log_test("Get All Locations", False, f"Failed with status {response.status_code}: {response.text}")
                return []
                
        except Exception as e:
            self.log_test("Get All Locations", False, f"Exception occurred: {str(e)}")
            return []
    
    def test_get_locations_with_filters(self):
        """Test GET /api/locations with various filters"""
        filters_to_test = [
            {"location_type": "cafe"},
            {"privacy_level": "private"},
            {"free_only": "true"},
            {"verified_only": "true"},
            {"location_type": "restaurant", "privacy_level": "private"}
        ]
        
        for filter_params in filters_to_test:
            try:
                response = self.session.get(f"{self.base_url}/locations", params=filter_params)
                
                if response.status_code == 200:
                    locations = response.json()
                    filter_str = ", ".join([f"{k}={v}" for k, v in filter_params.items()])
                    self.log_test(f"Get Locations with Filters ({filter_str})", True, 
                                f"Retrieved {len(locations)} filtered locations")
                else:
                    self.log_test(f"Get Locations with Filters ({filter_str})", False, 
                                f"Failed with status {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Get Locations with Filters ({filter_str})", False, f"Exception: {str(e)}")
    
    def test_create_location(self):
        """Test POST /api/locations"""
        new_location = {
            "name": "Mama Bear Nursing Lounge",
            "address": "456 Rue de Rivoli, Paris 75001",
            "latitude": 48.8606,
            "longitude": 2.3376,
            "location_type": "cafe",
            "privacy_level": "private",
            "requires_purchase": False,
            "description": "Dedicated nursing lounge with comfortable seating and privacy screens",
            "amenities": ["private_room", "comfortable_seating", "changing_table", "wifi"],
            "photos": []
        }
        
        try:
            response = self.session.post(f"{self.base_url}/locations", json=new_location)
            
            if response.status_code == 200:
                location_data = response.json()
                self.created_location_id = location_data.get("id")
                self.log_test("Create Location", True, f"Location created with ID: {self.created_location_id}")
                return location_data
            else:
                self.log_test("Create Location", False, f"Failed with status {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Create Location", False, f"Exception occurred: {str(e)}")
            return None
    
    def test_get_single_location(self, location_id):
        """Test GET /api/locations/{id}"""
        try:
            response = self.session.get(f"{self.base_url}/locations/{location_id}")
            
            if response.status_code == 200:
                location = response.json()
                self.log_test("Get Single Location", True, f"Retrieved location: {location.get('name', 'Unknown')}")
                return location
            elif response.status_code == 404:
                self.log_test("Get Single Location", False, "Location not found (404)")
                return None
            else:
                self.log_test("Get Single Location", False, f"Failed with status {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Get Single Location", False, f"Exception occurred: {str(e)}")
            return None
    
    def test_create_review(self, location_id):
        """Test POST /api/reviews"""
        new_review = {
            "location_id": location_id,
            "staff_rating": 5,
            "comfort_rating": 4,
            "privacy_rating": 5,
            "safety_rating": 4,
            "would_return": True,
            "comment": "Excellent nursing facilities! Very clean and private. Staff was extremely helpful and understanding.",
            "issues": [],
            "photos": [],
            "anonymous": False,
            "reviewer_name": "Emma Johnson"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/reviews", json=new_review)
            
            if response.status_code == 200:
                review_data = response.json()
                self.created_review_id = review_data.get("id")
                overall_rating = review_data.get("overall_rating", 0)
                self.log_test("Create Review", True, f"Review created with ID: {self.created_review_id}, Overall rating: {overall_rating}")
                return review_data
            else:
                self.log_test("Create Review", False, f"Failed with status {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Create Review", False, f"Exception occurred: {str(e)}")
            return None
    
    def test_get_reviews(self, location_id):
        """Test GET /api/reviews/{location_id}"""
        try:
            response = self.session.get(f"{self.base_url}/reviews/{location_id}")
            
            if response.status_code == 200:
                reviews = response.json()
                self.log_test("Get Reviews", True, f"Retrieved {len(reviews)} reviews for location")
                return reviews
            else:
                self.log_test("Get Reviews", False, f"Failed with status {response.status_code}: {response.text}")
                return []
                
        except Exception as e:
            self.log_test("Get Reviews", False, f"Exception occurred: {str(e)}")
            return []
    
    def test_mark_review_helpful(self, review_id):
        """Test POST /api/reviews/{review_id}/helpful"""
        try:
            response = self.session.post(f"{self.base_url}/reviews/{review_id}/helpful")
            
            if response.status_code == 200:
                self.log_test("Mark Review Helpful", True, "Review marked as helpful successfully")
                return True
            elif response.status_code == 404:
                self.log_test("Mark Review Helpful", False, "Review not found (404)")
                return False
            else:
                self.log_test("Mark Review Helpful", False, f"Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Mark Review Helpful", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_save_location(self, location_id):
        """Test POST /api/saved"""
        save_data = {
            "location_id": location_id,
            "user_id": "test_user_emma"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/saved", json=save_data)
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("Save Location", True, f"Location saved: {result.get('message', 'Success')}")
                return True
            else:
                self.log_test("Save Location", False, f"Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Save Location", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_check_if_saved(self, location_id):
        """Test GET /api/saved/check/{location_id}"""
        try:
            response = self.session.get(f"{self.base_url}/saved/check/{location_id}", 
                                      params={"user_id": "test_user_emma"})
            
            if response.status_code == 200:
                result = response.json()
                is_saved = result.get("saved", False)
                self.log_test("Check If Saved", True, f"Location saved status: {is_saved}")
                return is_saved
            else:
                self.log_test("Check If Saved", False, f"Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Check If Saved", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_get_saved_locations(self):
        """Test GET /api/saved"""
        try:
            response = self.session.get(f"{self.base_url}/saved", params={"user_id": "test_user_emma"})
            
            if response.status_code == 200:
                saved_locations = response.json()
                self.log_test("Get Saved Locations", True, f"Retrieved {len(saved_locations)} saved locations")
                return saved_locations
            else:
                self.log_test("Get Saved Locations", False, f"Failed with status {response.status_code}: {response.text}")
                return []
                
        except Exception as e:
            self.log_test("Get Saved Locations", False, f"Exception occurred: {str(e)}")
            return []
    
    def test_unsave_location(self, location_id):
        """Test DELETE /api/saved/{location_id}"""
        try:
            response = self.session.delete(f"{self.base_url}/saved/{location_id}", 
                                         params={"user_id": "test_user_emma"})
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("Unsave Location", True, f"Location unsaved: {result.get('message', 'Success')}")
                return True
            else:
                self.log_test("Unsave Location", False, f"Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Unsave Location", False, f"Exception occurred: {str(e)}")
            return False
    
    def test_delete_location(self, location_id):
        """Test DELETE /api/locations/{location_id}"""
        try:
            response = self.session.delete(f"{self.base_url}/locations/{location_id}")
            
            if response.status_code == 200:
                self.log_test("Delete Location", True, "Location deleted successfully")
                return True
            elif response.status_code == 404:
                self.log_test("Delete Location", False, "Location not found (404)")
                return False
            else:
                self.log_test("Delete Location", False, f"Failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Delete Location", False, f"Exception occurred: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run complete test suite"""
        print(f"🧪 Starting Doudou API Tests")
        print(f"🔗 Backend URL: {self.base_url}")
        print("=" * 60)
        
        # 1. Seed data first
        if not self.test_seed_data():
            print("❌ Seeding failed - stopping tests")
            return False
        
        # 2. Test getting locations
        locations = self.test_get_all_locations()
        if not locations:
            print("❌ No locations available - stopping tests")
            return False
        
        # Use first location for testing
        first_location_id = locations[0]["id"]
        
        # 3. Test location filters
        self.test_get_locations_with_filters()
        
        # 4. Test single location retrieval
        self.test_get_single_location(first_location_id)
        
        # 5. Test creating new location
        new_location = self.test_create_location()
        test_location_id = self.created_location_id or first_location_id
        
        # 6. Test reviews
        new_review = self.test_create_review(test_location_id)
        self.test_get_reviews(test_location_id)
        
        if self.created_review_id:
            self.test_mark_review_helpful(self.created_review_id)
        
        # 7. Test saved locations
        self.test_save_location(test_location_id)
        self.test_check_if_saved(test_location_id)
        self.test_get_saved_locations()
        self.test_unsave_location(test_location_id)
        
        # 8. Test deletion (only if we created a location)
        if self.created_location_id:
            self.test_delete_location(self.created_location_id)
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if total - passed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   • {result['test']}: {result['message']}")
        
        return passed == total

def main():
    """Main test execution"""
    tester = DoudouAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend API is working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")
        sys.exit(1)

if __name__ == "__main__":
    main()