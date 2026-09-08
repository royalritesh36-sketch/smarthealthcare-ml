from ucimlrepo import fetch_ucirepo
import pandas as pd
import os

print("Downloading UCI Heart Disease dataset...")

# Fetch UCI Heart Disease dataset
heart_disease = fetch_ucirepo(id=45)

# Get features
X = heart_disease.data.features.copy()

# Get target
y = heart_disease.data.targets.copy()

print("\nOriginal feature columns:")
print(X.columns.tolist())

print("\nTarget columns:")
print(y.columns.tolist())

# Rename target column
y.columns = ["target"]

# Combine features and target
df = pd.concat([X, y], axis=1)

# Convert original target:
# 0 = no disease
# 1,2,3,4 = disease
df["target"] = (df["target"] > 0).astype(int)

# Create data folder
os.makedirs("data", exist_ok=True)

# Save CSV
output_path = "data/heart.csv"

df.to_csv(output_path, index=False)

print("\nDataset saved successfully!")
print(f"Location: {output_path}")

print("\nDataset shape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())

print("\nTarget distribution:")
print(df["target"].value_counts())