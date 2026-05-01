"""
Simple heuristic-based waste classifier for demo purposes.
Uses color analysis and basic image features to make educated guesses.
This provides more realistic predictions than random weights until a proper model is trained.
"""

import numpy as np
from PIL import Image
import io
from typing import Dict
from .reuse_suggestions import ReuseSuggestions


class SimpleWasteClassifier:
    """Demo classifier using color and texture heuristics."""
    
    CLASS_LABELS = [
        "rice_straw",
        "wheat_stubble",
        "sugarcane_bagasse",
        "corn_husk",
        "other_crop_residue"
    ]
    
    def __init__(self):
        pass
    
    def analyze_color(self, img_array: np.ndarray) -> Dict[str, float]:
        """
        Analyze color characteristics to estimate waste type.
        
        Different waste types have characteristic colors:
        - Rice straw: Golden yellow, bright (high R, high G, low B)
        - Wheat stubble: Light tan/beige (balanced but slightly brown)
        - Sugarcane bagasse: Brown/tan (darker, more red)
        - Corn husk: Green/yellow when fresh, brown when dry
        - Other: Varies
        """
        # Convert to RGB if needed
        if len(img_array.shape) == 2:  # Grayscale
            img_array = np.stack([img_array] * 3, axis=-1)
        
        # Get average color values (normalized 0-1)
        avg_r = np.mean(img_array[:, :, 0]) / 255.0
        avg_g = np.mean(img_array[:, :, 1]) / 255.0
        avg_b = np.mean(img_array[:, :, 2]) / 255.0
        
        # Calculate saturation
        max_rgb = max(avg_r, avg_g, avg_b)
        min_rgb = min(avg_r, avg_g, avg_b)
        saturation = (max_rgb - min_rgb) / max_rgb if max_rgb > 0 else 0
        
        # Calculate brightness
        brightness = (avg_r + avg_g + avg_b) / 3
        
        # Yellow-ness: how much yellow vs blue
        yellowness = (avg_r + avg_g) / 2 - avg_b
        
        # Heuristic scoring based on color characteristics
        scores = {}
        
        # Rice straw: Golden yellow, HIGH brightness, strong yellow
        # Characteristic: bright, saturated yellow-gold
        rice_base = 0.2
        if brightness > 0.5:  # Bright image
            rice_base += 0.3
        if yellowness > 0.15:  # Strong yellow
            rice_base += 0.4
        if avg_r > 0.55 and avg_g > 0.5 and avg_b < 0.4:  # Golden range
            rice_base += 0.3
        scores['rice_straw'] = min(1.0, rice_base)
        
        # Wheat stubble: Light beige/tan, less saturated than rice
        # Characteristic: lighter, less yellow, more balanced
        wheat_base = 0.2
        if 0.4 < brightness < 0.7:  # Medium brightness
            wheat_base += 0.25
        if saturation < 0.2:  # Low saturation (beige/tan)
            wheat_base += 0.3
        if abs(avg_r - avg_g) < 0.1:  # Balanced red-green
            wheat_base += 0.2
        if yellowness > 0.05 and yellowness < 0.2:  # Slight yellow
            wheat_base += 0.15
        scores['wheat_stubble'] = min(1.0, wheat_base)
        
        # Sugarcane bagasse: Brown/tan, darker
        # Characteristic: more red than green, medium-low brightness
        bagasse_base = 0.15
        if brightness < 0.5:  # Darker
            bagasse_base += 0.25
        if avg_r > avg_g and avg_r > avg_b:  # Reddish
            bagasse_base += 0.3
        if saturation > 0.15:  # Some saturation
            bagasse_base += 0.2
        scores['sugarcane_bagasse'] = min(1.0, bagasse_base)
        
        # Corn husk: Green-yellow when fresh
        # Characteristic: greenish tint
        corn_base = 0.15
        if avg_g > avg_r and avg_g > avg_b:  # Green dominant
            corn_base += 0.4
        elif avg_g > 0.5:  # High green value
            corn_base += 0.25
        if yellowness > -0.1 and yellowness < 0.15:  # Slight yellow-green
            corn_base += 0.2
        scores['corn_husk'] = min(1.0, corn_base)
        
        # Other: Default baseline
        scores['other_crop_residue'] = 0.3
        
        return scores
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """Preprocess image for analysis."""
        img = Image.open(io.BytesIO(image_bytes))
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize for faster processing
        img = img.resize((224, 224))
        img_array = np.array(img)
        
        return img_array
    
    def predict(self, image_bytes: bytes) -> Dict:
        """
        Classify waste using color heuristics.
        
        Args:
            image_bytes: Raw image bytes
        
        Returns:
            Dictionary with prediction results
        """
        # Preprocess image
        img_array = self.preprocess_image(image_bytes)
        
        # Analyze colors
        color_scores = self.analyze_color(img_array)
        
        # Normalize scores to sum to 1 (make them probabilities)
        total_score = sum(color_scores.values())
        if total_score > 0:
            probabilities = {k: v / total_score for k, v in color_scores.items()}
        else:
            # Fallback to uniform distribution
            probabilities = {k: 1.0 / len(self.CLASS_LABELS) for k in self.CLASS_LABELS}
        
        # Add some randomness to make it look more realistic (10% noise)
        noise = np.random.uniform(-0.05, 0.05, len(self.CLASS_LABELS))
        for i, label in enumerate(self.CLASS_LABELS):
            probabilities[label] = max(0, probabilities[label] + noise[i])
        
        # Re-normalize
        total = sum(probabilities.values())
        probabilities = {k: v / total for k, v in probabilities.items()}
        
        # Get top prediction
        predicted_class = max(probabilities, key=probabilities.get)
        confidence = probabilities[predicted_class]
        
        # Get reuse suggestions
        reuse_data = ReuseSuggestions.get_suggestions(predicted_class)
        
        return {
            "predicted_class": predicted_class,
            "display_name": reuse_data["display_name"],
            "confidence": confidence,
            "all_predictions": probabilities,
            "industrial_uses": reuse_data["industrial_uses"],
            "environmental_benefits": reuse_data["environmental_benefits"],
            "price_range": reuse_data["price_range"]
        }


# Global instance
_simple_classifier = None

def get_simple_classifier() -> SimpleWasteClassifier:
    """Get or create simple classifier instance."""
    global _simple_classifier
    if _simple_classifier is None:
        _simple_classifier = SimpleWasteClassifier()
    return _simple_classifier
