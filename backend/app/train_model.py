"""
Training script for agricultural waste classification model.
This script trains a transfer learning model on agricultural waste images.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import json
from datetime import datetime

# Class labels
CLASS_LABELS = [
    "rice_straw",
    "wheat_stubble",
    "sugarcane_bagasse",
    "corn_husk",
    "other_crop_residue"
]


def create_model(num_classes: int = 5, input_shape=(224, 224, 3)):
    """Create transfer learning model with MobileNetV2 base."""
    
    # Load pre-trained MobileNetV2
    base_model = MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers initially
    base_model.trainable = False
    
    # Create model with custom classification head
    model = keras.Sequential([
        base_model,
        keras.layers.GlobalAveragePooling2D(),
        keras.layers.BatchNormalization(),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(256, activation='relu'),
        keras.layers.BatchNormalization(),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(128, activation='relu'),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(num_classes, activation='softmax')
    ])
    
    return model, base_model


def train_model(
    train_dir: str,
    val_dir: str,
    output_dir: str = "models/waste_classifier",
    epochs: int = 30,
    batch_size: int = 32,
    fine_tune: bool = True
):
    """
    Train the waste classification model.
    
    Args:
        train_dir: Directory containing training images organized by class
        val_dir: Directory containing validation images organized by class
        output_dir: Directory to save trained model
        epochs: Number of training epochs
        batch_size: Training batch size
        fine_tune: Whether to fine-tune base model after initial training
    """
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        vertical_flip=True,
        fill_mode='nearest'
    )
    
    # Only rescaling for validation
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    # Load training data
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        classes=CLASS_LABELS,
        shuffle=True
    )
    
    # Load validation data
    val_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        classes=CLASS_LABELS,
        shuffle=False
    )
    
    # Create model
    model, base_model = create_model(num_classes=len(CLASS_LABELS))
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=3)]
    )
    
    print("Model Summary:")
    model.summary()
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            filepath=os.path.join(output_dir, 'model_best.h5'),
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Phase 1: Train classification head
    print("\n" + "="*50)
    print("Phase 1: Training classification head...")
    print("="*50 + "\n")
    
    history1 = model.fit(
        train_generator,
        epochs=epochs // 2,
        validation_data=val_generator,
        callbacks=callbacks,
        verbose=1
    )
    
    # Phase 2: Fine-tune entire model
    if fine_tune:
        print("\n" + "="*50)
        print("Phase 2: Fine-tuning base model...")
        print("="*50 + "\n")
        
        # Unfreeze base model
        base_model.trainable = True
        
        # Recompile with lower learning rate
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=1e-5),
            loss='categorical_crossentropy',
            metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=3)]
        )
        
        history2 = model.fit(
            train_generator,
            epochs=epochs // 2,
            validation_data=val_generator,
            callbacks=callbacks,
            verbose=1
        )
    
    # Save final model
    final_model_path = os.path.join(output_dir, 'model_final.h5')
    model.save(final_model_path)
    print(f"\nFinal model saved to: {final_model_path}")
    
    # Save class labels
    labels_path = os.path.join(output_dir, 'class_labels.json')
    with open(labels_path, 'w') as f:
        json.dump(CLASS_LABELS, f, indent=2)
    print(f"Class labels saved to: {labels_path}")
    
    # Evaluate on validation set
    print("\n" + "="*50)
    print("Final Evaluation:")
    print("="*50 + "\n")
    
    results = model.evaluate(val_generator, verbose=1)
    metrics = dict(zip(model.metrics_names, results))
    
    # Save training metadata
    metadata = {
        "training_date": datetime.now().isoformat(),
        "num_classes": len(CLASS_LABELS),
        "class_labels": CLASS_LABELS,
        "epochs_trained": epochs,
        "batch_size": batch_size,
        "fine_tuned": fine_tune,
        "final_metrics": metrics,
        "num_train_samples": train_generator.samples,
        "num_val_samples": val_generator.samples
    }
    
    metadata_path = os.path.join(output_dir, 'model_metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"\nMetadata saved to: {metadata_path}")
    
    print("\n" + "="*50)
    print("Training Complete!")
    print(f"Final Validation Accuracy: {metrics['accuracy']:.2%}")
    print(f"Top-3 Accuracy: {metrics['top_k_categorical_accuracy']:.2%}")
    print("="*50 + "\n")


def create_demo_dataset(output_dir: str = "data/waste_demo"):
    """
    Create a demo dataset structure for testing.
    This creates placeholder directories - you'll need to add actual images.
    """
    train_dir = os.path.join(output_dir, "train")
    val_dir = os.path.join(output_dir, "val")
    
    for split_dir in [train_dir, val_dir]:
        for class_label in CLASS_LABELS:
            class_dir = os.path.join(split_dir, class_label)
            os.makedirs(class_dir, exist_ok=True)
    
    print(f"\nDemo dataset structure created at: {output_dir}")
    print("\nPlease add images to the following directories:")
    print(f"  Training: {train_dir}")
    print(f"  Validation: {val_dir}")
    print("\nOrganize images by class (e.g., train/rice_straw/, train/wheat_stubble/, etc.)")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Train agricultural waste classification model"
    )
    parser.add_argument(
        '--train-dir',
        type=str,
        help='Path to training data directory'
    )
    parser.add_argument(
        '--val-dir',
        type=str,
        help='Path to validation data directory'
    )
    parser.add_argument(
        '--output-dir',
        type=str,
        default='models/waste_classifier',
        help='Directory to save trained model'
    )
    parser.add_argument(
        '--epochs',
        type=int,
        default=30,
        help='Number of training epochs'
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=32,
        help='Training batch size'
    )
    parser.add_argument(
        '--no-fine-tune',
        action='store_true',
        help='Skip fine-tuning phase'
    )
    parser.add_argument(
        '--create-demo',
        action='store_true',
        help='Create demo dataset structure'
    )
    
    args = parser.parse_args()
    
    if args.create_demo:
        create_demo_dataset()
    elif args.train_dir and args.val_dir:
        train_model(
            train_dir=args.train_dir,
            val_dir=args.val_dir,
            output_dir=args.output_dir,
            epochs=args.epochs,
            batch_size=args.batch_size,
            fine_tune=not args.no_fine_tune
        )
    else:
        print("Error: Please provide --train-dir and --val-dir, or use --create-demo")
        parser.print_help()
