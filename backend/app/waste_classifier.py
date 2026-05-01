"""
Agricultural Waste Classification Model using Transfer Learning.
Uses MobileNetV2 as base with custom classification head.
"""

import os
import numpy as np
from PIL import Image
import io
from typing import Dict, Tuple, List
import logging

# Set TensorFlow to use only CPU and reduce logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.preprocessing import image
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
except ImportError:
    raise ImportError(
        "TensorFlow is required. Install with: pip install tensorflow"
    )

from .reuse_suggestions import ReuseSuggestions

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WasteClassifier:
    """Image-based agricultural waste classifier using transfer learning."""
    
    # Class labels - order matches model output
    CLASS_LABELS = [
        "rice_straw",
        "wheat_stubble", 
        "sugarcane_bagasse",
        "corn_husk",
        "other_crop_residue"
    ]
    
    IMG_SIZE = (224, 224)  # MobileNetV2 input size
    
    def __init__(self, model_path: str = None):
        """
        Initialize the waste classifier.
        
        Args:
            model_path: Path to saved model weights. If None, uses pre-trained 
                       MobileNetV2 with random classification head (demo mode).
        """
        self.model_path = model_path
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load or create the classification model."""
        if self.model_path and os.path.exists(self.model_path):
            # Load trained model
            logger.info(f"Loading trained model from {self.model_path}")
            self.model = keras.models.load_model(self.model_path)
        else:
            # Create demo model with pre-trained MobileNetV2 base
            logger.warning(
                "No trained model found. Using demo mode with pre-trained base."
            )
            self.model = self._create_demo_model()
    
    def _create_demo_model(self) -> keras.Model:
        """
        Create a demo model using pre-trained MobileNetV2.
        Note: This is for demonstration only. Predictions will be based on 
        image features but not specifically trained on agricultural waste.
        """
        # Load pre-trained MobileNetV2 (ImageNet weights)
        base_model = MobileNetV2(
            input_shape=(224, 224, 3),
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False  # Freeze base layers
        
        # Add custom classification head
        model = keras.Sequential([
            base_model,
            keras.layers.GlobalAveragePooling2D(),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(128, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(len(self.CLASS_LABELS), activation='softmax')
        ])
        
        # Initialize with random weights (for demo purposes)
        # In production, this would be trained on labeled data
        logger.info("Demo model created with random classification head")
        return model
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """
        Preprocess uploaded image for model input.
        
        Args:
            image_bytes: Raw image bytes from upload
        
        Returns:
            Preprocessed image array ready for model
        """
        # Load image from bytes
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to model input size
        img = img.resize(self.IMG_SIZE)
        
        # Convert to array and preprocess for MobileNetV2
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        return img_array
    
    def predict(self, image_bytes: bytes) -> Dict:
        """
        Classify agricultural waste from image.
        
        Args:
            image_bytes: Raw image bytes
        
        Returns:
            Dictionary containing:
                - predicted_class: Waste type name
                - confidence: Confidence score (0-1)
                - all_predictions: All class probabilities
                - reuse_suggestions: Industrial reuse recommendations
        """
        # Preprocess image
        processed_img = self.preprocess_image(image_bytes)
        
        # Get predictions
        predictions = self.model.predict(processed_img, verbose=0)[0]
        
        # Get top prediction
        top_idx = np.argmax(predictions)
        predicted_class = self.CLASS_LABELS[top_idx]
        confidence = float(predictions[top_idx])
        
        # Get all predictions with labels
        all_predictions = {
            label: float(score) 
            for label, score in zip(self.CLASS_LABELS, predictions)
        }
        
        # Get reuse suggestions for predicted class
        reuse_data = ReuseSuggestions.get_suggestions(predicted_class)
        
        logger.info(
            f"Prediction: {predicted_class} (confidence: {confidence:.2%})"
        )
        
        return {
            "predicted_class": predicted_class,
            "display_name": reuse_data["display_name"],
            "confidence": confidence,
            "all_predictions": all_predictions,
            "industrial_uses": reuse_data["industrial_uses"],
            "environmental_benefits": reuse_data["environmental_benefits"],
            "price_range": reuse_data["price_range"]
        }
    
    def predict_top_k(self, image_bytes: bytes, k: int = 3) -> List[Dict]:
        """
        Get top-k predictions for an image.
        
        Args:
            image_bytes: Raw image bytes
            k: Number of top predictions to return
        
        Returns:
            List of prediction dictionaries sorted by confidence
        """
        # Preprocess image
        processed_img = self.preprocess_image(image_bytes)
        
        # Get predictions
        predictions = self.model.predict(processed_img, verbose=0)[0]
        
        # Get top-k indices
        top_indices = np.argsort(predictions)[-k:][::-1]
        
        results = []
        for idx in top_indices:
            waste_type = self.CLASS_LABELS[idx]
            confidence = float(predictions[idx])
            reuse_data = ReuseSuggestions.get_suggestions(waste_type)
            
            results.append({
                "predicted_class": waste_type,
                "display_name": reuse_data["display_name"],
                "confidence": confidence,
                "price_range": reuse_data["price_range"]
            })
        
        return results


# Global classifier instance (singleton pattern)
_classifier_instance = None

def get_classifier(model_path: str = None) -> WasteClassifier:
    """
    Get or create the global classifier instance.
    
    Args:
        model_path: Optional path to trained model
    
    Returns:
        WasteClassifier instance
    """
    global _classifier_instance
    
    if _classifier_instance is None:
        _classifier_instance = WasteClassifier(model_path)
    
    return _classifier_instance
