import os
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    GridSearchCV
)

from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import (
    RandomForestClassifier,
    ExtraTreesClassifier,
    GradientBoostingClassifier
)

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix
)

from sklearn.calibration import CalibratedClassifierCV


# ==========================================================
# CONFIGURATION
# ==========================================================

DATA_PATH = "data/heart.csv"
MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)

RANDOM_STATE = 42


# ==========================================================
# LOAD DATASET
# ==========================================================

print("=" * 60)
print("SMART HEALTHCARE - ML MODEL TRAINING")
print("=" * 60)

print("\nLoading dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset shape: {df.shape}")


# ==========================================================
# FEATURES
# ==========================================================

features = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal"
]

target = "target"


# ==========================================================
# VALIDATE DATASET
# ==========================================================

missing_columns = [
    column for column in features + [target]
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing columns in dataset: {missing_columns}"
    )


X = df[features].copy()
y = df[target].copy()


# ==========================================================
# CLEAN TARGET
# ==========================================================

# UCI target:
# 0 = no disease
# 1-4 = disease
#
# Convert to binary classification.

y = (y > 0).astype(int)


print("\nTarget distribution:")
print(y.value_counts())

print("\nMissing values:")
print(X.isnull().sum())


# ==========================================================
# TRAIN / TEST SPLIT
# ==========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=RANDOM_STATE,
    stratify=y
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ==========================================================
# CROSS VALIDATION
# ==========================================================

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=RANDOM_STATE
)


# ==========================================================
# MODEL 1 - LOGISTIC REGRESSION
# ==========================================================

logistic_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(strategy="median")
    ),
    (
        "scaler",
        StandardScaler()
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=2000,
            random_state=RANDOM_STATE
        )
    )
])

logistic_params = {
    "classifier__C": [
        0.01,
        0.1,
        1,
        10,
        100
    ],

    "classifier__solver": [
        "liblinear",
        "lbfgs"
    ]
}


# ==========================================================
# MODEL 2 - RANDOM FOREST
# ==========================================================

random_forest_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(strategy="median")
    ),
    (
        "classifier",
        RandomForestClassifier(
            random_state=RANDOM_STATE,
            class_weight="balanced"
        )
    )
])

random_forest_params = {
    "classifier__n_estimators": [
        200,
        400,
        600
    ],

    "classifier__max_depth": [
        None,
        5,
        8,
        12
    ],

    "classifier__min_samples_split": [
        2,
        5,
        10
    ],

    "classifier__min_samples_leaf": [
        1,
        2,
        4
    ],

    "classifier__max_features": [
        "sqrt",
        "log2"
    ]
}


# ==========================================================
# MODEL 3 - EXTRA TREES
# ==========================================================

extra_trees_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(strategy="median")
    ),
    (
        "classifier",
        ExtraTreesClassifier(
            random_state=RANDOM_STATE,
            class_weight="balanced"
        )
    )
])

extra_trees_params = {
    "classifier__n_estimators": [
        200,
        400,
        600
    ],

    "classifier__max_depth": [
        None,
        5,
        8,
        12
    ],

    "classifier__min_samples_split": [
        2,
        5,
        10
    ],

    "classifier__min_samples_leaf": [
        1,
        2,
        4
    ]
}


# ==========================================================
# MODEL 4 - GRADIENT BOOSTING
# ==========================================================

gradient_pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(strategy="median")
    ),
    (
        "classifier",
        GradientBoostingClassifier(
            random_state=RANDOM_STATE
        )
    )
])

gradient_params = {
    "classifier__n_estimators": [
        50,
        100,
        200
    ],

    "classifier__learning_rate": [
        0.01,
        0.05,
        0.1
    ],

    "classifier__max_depth": [
        2,
        3,
        4
    ]
}


# ==========================================================
# TRAIN AND COMPARE MODELS
# ==========================================================

models = [
    (
        "Logistic Regression",
        logistic_pipeline,
        logistic_params
    ),

    (
        "Random Forest",
        random_forest_pipeline,
        random_forest_params
    ),

    (
        "Extra Trees",
        extra_trees_pipeline,
        extra_trees_params
    ),

    (
        "Gradient Boosting",
        gradient_pipeline,
        gradient_params
    )
]


results = []


for name, pipeline, params in models:

    print("\n" + "=" * 60)
    print(f"Training: {name}")
    print("=" * 60)

    grid = GridSearchCV(
        estimator=pipeline,
        param_grid=params,
        cv=cv,
        scoring="roc_auc",
        n_jobs=-1,
        verbose=0
    )

    grid.fit(X_train, y_train)

    best_model = grid.best_estimator_

    predictions = best_model.predict(X_test)

    probabilities = best_model.predict_proba(
        X_test
    )[:, 1]

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    precision = precision_score(
        y_test,
        predictions,
        zero_division=0
    )

    recall = recall_score(
        y_test,
        predictions,
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        predictions,
        zero_division=0
    )

    auc = roc_auc_score(
        y_test,
        probabilities
    )

    results.append({
        "model": name,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "roc_auc": auc,
        "estimator": best_model
    })

    print(f"\nBest parameters:")
    print(grid.best_params_)

    print(f"\nAccuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")
    print(f"ROC-AUC  : {auc:.4f}")


# ==========================================================
# SELECT BEST MODEL
# ==========================================================

results_df = pd.DataFrame([
    {
        "Model": r["model"],
        "Accuracy": r["accuracy"],
        "Precision": r["precision"],
        "Recall": r["recall"],
        "F1": r["f1"],
        "ROC-AUC": r["roc_auc"]
    }
    for r in results
])


print("\n")
print("=" * 60)
print("MODEL COMPARISON")
print("=" * 60)

print(
    results_df.sort_values(
        "ROC-AUC",
        ascending=False
    ).to_string(index=False)
)


best_result = max(
    results,
    key=lambda x: x["roc_auc"]
)

best_model = best_result["estimator"]

print("\n")
print("=" * 60)
print("BEST MODEL")
print("=" * 60)

print(
    f"Selected Model: {best_result['model']}"
)

print(
    f"ROC-AUC: {best_result['roc_auc']:.4f}"
)


# ==========================================================
# CALIBRATE PROBABILITY
# ==========================================================

print("\nCalibrating prediction probabilities...")

calibrated_model = CalibratedClassifierCV(
    estimator=best_model,
    method="sigmoid",
    cv=cv
)

calibrated_model.fit(
    X_train,
    y_train
)


# ==========================================================
# FINAL EVALUATION
# ==========================================================

final_predictions = calibrated_model.predict(
    X_test
)

final_probabilities = calibrated_model.predict_proba(
    X_test
)[:, 1]


final_accuracy = accuracy_score(
    y_test,
    final_predictions
)

final_precision = precision_score(
    y_test,
    final_predictions,
    zero_division=0
)

final_recall = recall_score(
    y_test,
    final_predictions,
    zero_division=0
)

final_f1 = f1_score(
    y_test,
    final_predictions,
    zero_division=0
)

final_auc = roc_auc_score(
    y_test,
    final_probabilities
)


print("\n")
print("=" * 60)
print("FINAL CALIBRATED MODEL")
print("=" * 60)

print(f"Accuracy : {final_accuracy:.4f}")
print(f"Precision: {final_precision:.4f}")
print(f"Recall   : {final_recall:.4f}")
print(f"F1 Score : {final_f1:.4f}")
print(f"ROC-AUC  : {final_auc:.4f}")


print("\nClassification Report:")
print(
    classification_report(
        y_test,
        final_predictions,
        target_names=[
            "No Disease",
            "Disease"
        ],
        zero_division=0
    )
)


print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_test,
        final_predictions
    )
)


# ==========================================================
# SAVE MODEL
# ==========================================================

model_path = os.path.join(
    MODEL_DIR,
    "heart_model.pkl"
)

joblib.dump(
    calibrated_model,
    model_path
)


# Keep metadata for the project
metadata = {
    "features": features,
    "model": best_result["model"],
    "accuracy": final_accuracy,
    "precision": final_precision,
    "recall": final_recall,
    "f1": final_f1,
    "roc_auc": final_auc,
    "dataset_rows": len(df)
}

metadata_path = os.path.join(
    MODEL_DIR,
    "model_metadata.pkl"
)

joblib.dump(
    metadata,
    metadata_path
)


print("\n")
print("=" * 60)
print("MODEL SAVED")
print("=" * 60)

print(f"Model: {model_path}")
print(f"Metadata: {metadata_path}")

print("\nTraining completed successfully.")