import numpy as np
import joblib

class CustomStandardScaler:
    def __init__(self):
        self.mean_ = None
        self.std_ = None

    def fit(self, X):
        self.mean_ = np.mean(X, axis=0)
        self.std_ = np.std(X, axis=0)
        self.std_ = np.where(self.std_ == 0, 1, self.std_)  # Avoid division by zero

    def transform(self, X):
        return (X - self.mean_) / self.std_

    def fit_transform(self, X):
        self.fit(X)
        return self.transform(X)

    def inverse_transform(self, X_scaled):
        X_scaled = np.array(X_scaled)  # Ensure it's a NumPy array
        return (X_scaled * self.std_.reshape(1, -1)) + self.mean_.reshape(1, -1)


    def save_scaler(self, filepath):
        """Save scaler parameters to a file"""
        scaler_data = {"mean": self.mean_, "std": self.std_}
        joblib.dump(scaler_data, filepath)

    @classmethod
    def load_scaler(cls, filepath):
        """Load scaler parameters from a file"""
        scaler_data = joblib.load(filepath)
        scaler = cls()
        scaler.mean_ = scaler_data["mean"]
        scaler.std_ = scaler_data["std"]
        return scaler
