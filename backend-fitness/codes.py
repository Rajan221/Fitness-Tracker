import numpy as np
import joblib


#scaler ko code

class CustomStandardScaler:
    def __init__(self):
        self.mean_ = None
        self.std_ = None

    def fit(self, X):
        self.mean_ = np.mean(X, axis=0)
        self.std_ = np.std(X, axis=0)
        self.std_ = np.where(self.std_ == 0, 1, self.std_)  

    def transform(self, X):
        return (X - self.mean_) / self.std_

    def fit_transform(self, X):
        self.fit(X)
        return self.transform(X)

    def inverse_transform(self, X_scaled):
      X_scaled = np.array(X_scaled)  
      return (X_scaled * self.std_.reshape(1, -1)) + self.mean_.reshape(1, -1)


    def save_scaler(self, filepath):
        scaler_data = {"mean": self.mean_, "std": self.std_}
        joblib.dump(scaler_data, filepath)

    @classmethod
    def load_scaler(cls, filepath):
        scaler_data = joblib.load(filepath)
        scaler = cls()
        scaler.mean_ = scaler_data["mean"]
        scaler.std_ = scaler_data["std"]
        return scaler


#train test split ko code
def custom_train_test_split(X, y, test_size=0.2, random_state=None):
    if random_state is not None:
        np.random.seed(random_state)

    num_samples = X.shape[0]
    indices = np.arange(num_samples)
    np.random.shuffle(indices)

    test_size_num = int(num_samples * test_size)
    train_size_num = num_samples - test_size_num

    train_indices = indices[:train_size_num]
    test_indices = indices[train_size_num:]
    X_train = X[train_indices]
    X_test = X[test_indices]
    y_train = y[train_indices]
    y_test = y[test_indices]

    return X_train, X_test, y_train, y_test


#relu, mse, r squared
import numpy as np

def relu(x):
    return np.maximum(0, x)

def relu_derivative(x):
    return np.where(x > 0, 1, 0)

def mean_squared_error(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)


def r_squared(y_true, y_pred):
    ss_total = np.sum((y_true - np.mean(y_true)) ** 2)
    ss_residual = np.sum((y_true - y_pred) ** 2)
    r2 = 1 - (ss_residual / ss_total)
    return r2




#algorithm ko code
class SimpleANN:

    #initialiazation of the model
    def __init__(self, input_size, hidden_size1, hidden_size2, output_size, learning_rate=0.01, batch_size=32):
        self.input_size = input_size
        self.hidden_size1 = hidden_size1
        self.hidden_size2 = hidden_size2
        self.output_size = output_size
        self.learning_rate = learning_rate
        self.batch_size = batch_size

        self.W1 = np.random.randn(self.input_size, self.hidden_size1) * 0.01
        self.b1 = np.zeros((1, self.hidden_size1))
        self.W2 = np.random.randn(self.hidden_size1, self.hidden_size2) * 0.01
        self.b2 = np.zeros((1, self.hidden_size2))
        self.W3 = np.random.randn(self.hidden_size2, self.output_size) * 0.01
        self.b3 = np.zeros((1, self.output_size))

    #training the model
    def train(self, X_train, y_train, epochs=1000):
        loss_history = []
        num_batches = X_train.shape[0] // self.batch_size

        for epoch in range(epochs):
            indices = np.random.permutation(X_train.shape[0])
            X_train_shuffled = X_train[indices]
            y_train_shuffled = y_train[indices]

            for batch_idx in range(num_batches):
                start_idx = batch_idx * self.batch_size
                end_idx = start_idx + self.batch_size
                X_batch = X_train_shuffled[start_idx:end_idx]
                y_batch = y_train_shuffled[start_idx:end_idx]

                y_pred = self.forward(X_batch)
                loss = mean_squared_error(y_batch, y_pred)
                self.backward(X_batch, y_batch, y_pred)

            loss_history.append(loss)
            if epoch % 100 == 0:
                print(f'Epoch {epoch+1}/{epochs}, Loss: {loss:.6f}')

    #saving the model
    def save_model(self, filename):
        model_data = {
            "W1": self.W1, "b1": self.b1,
            "W2": self.W2, "b2": self.b2,
            "W3": self.W3, "b3": self.b3,
            "input_size": self.input_size,
            "hidden_size1": self.hidden_size1,
            "hidden_size2": self.hidden_size2,
            "output_size": self.output_size,
            "learning_rate": self.learning_rate
        }
        joblib.dump(model_data, filename)
        print(f"Model saved to {filename}")

    #loading the model
    @staticmethod
    def load_model(filename):
        model_data = joblib.load(filename)
        model = SimpleANN(model_data["input_size"], model_data["hidden_size1"], model_data["hidden_size2"], model_data["output_size"], model_data["learning_rate"])
        model.W1, model.b1 = model_data["W1"], model_data["b1"]
        model.W2, model.b2 = model_data["W2"], model_data["b2"]
        model.W3, model.b3 = model_data["W3"], model_data["b3"]
        print(f"Model loaded from {filename}")
        return model

    #forward pass
    def forward(self, X):
        self.z1 = np.dot(X, self.W1) + self.b1
        self.a1 = relu(self.z1)
        
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        self.a2 = relu(self.z2)
        
        self.z3 = np.dot(self.a2, self.W3) + self.b3
        self.a3 = self.z3  # Linear output
        
        return self.a3

    #backward pass
    def backward(self, X, y, y_pred):
        d_loss = 2 * (y_pred - y) / y.shape[0]
        d_a3 = d_loss

        d_W3 = np.dot(self.a2.T, d_a3)
        d_b3 = np.sum(d_a3, axis=0, keepdims=True)

        d_a2 = np.dot(d_a3, self.W3.T) * relu_derivative(self.a2)
        d_W2 = np.dot(self.a1.T, d_a2)
        d_b2 = np.sum(d_a2, axis=0, keepdims=True)

        d_a1 = np.dot(d_a2, self.W2.T) * relu_derivative(self.a1)
        d_W1 = np.dot(X.T, d_a1)
        d_b1 = np.sum(d_a1, axis=0, keepdims=True)

        self.W1 -= self.learning_rate * d_W1
        self.b1 -= self.learning_rate * d_b1
        self.W2 -= self.learning_rate * d_W2
        self.b2 -= self.learning_rate * d_b2
        self.W3 -= self.learning_rate * d_W3
        self.b3 -= self.learning_rate * d_b3

    def predict(self, X):
        return self.forward(X)