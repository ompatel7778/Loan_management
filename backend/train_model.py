import os
import json
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def train_and_export():
    csv_path = 'Loan_default.csv'
    print('Loading dataset from', csv_path)
    df = pd.read_csv(csv_path)
    
    binary_cols = ['HasMortgage', 'HasDependents', 'HasCoSigner']
    for c in binary_cols:
        df[c] = df[c].map({'Yes': 1, 'No': 0})
        
    if 'LoanID' in df.columns:
        df = df.drop('LoanID', axis=1)
        
    cat_cols = ['Education', 'EmploymentType', 'MaritalStatus', 'LoanPurpose']
    df_encoded = pd.get_dummies(df, columns=cat_cols, drop_first=True)
    
    X = df_encoded.drop('Default', axis=1)
    y = df_encoded['Default']
    feat_names = list(X.columns)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    X_tr_sc = scaler.fit_transform(X_train)
    X_te_sc = scaler.transform(X_test)
    
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_tr_sc, y_train)
    
    y_pred = model.predict(X_te_sc)
    y_prob = model.predict_proba(X_te_sc)[:, 1]
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    roc_auc = float(roc_auc_score(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    print('Accuracy:', acc, 'ROC-AUC:', roc_auc, 'Precision:', prec, 'Recall:', rec)
    
    os.makedirs('backend', exist_ok=True)
    joblib.dump(model, 'backend/loan_model.joblib')
    joblib.dump(scaler, 'backend/loan_scaler.joblib')
    
    coef_list = []
    for feat, coef, mean, scale in zip(feat_names, model.coef_[0], scaler.mean_, scaler.scale_):
        coef_list.append({
            'feature': feat,
            'coefficient': float(coef),
            'mean': float(mean),
            'scale': float(scale)
        })
        
    metadata = {
        'model_type': 'Logistic Regression',
        'training_samples': int(len(X_train)),
        'testing_samples': int(len(X_test)),
        'features': feat_names,
        'intercept': float(model.intercept_[0]),
        'coefficients': coef_list,
        'metrics': {
            'accuracy': acc,
            'roc_auc': roc_auc,
            'precision': prec,
            'recall': rec,
            'f1': f1,
            'confusion_matrix': cm
        },
        'feature_ranges': {
            'Age': {'min': 18, 'max': 75, 'default': 35, 'mean': 43.35, 'label': 'Age (Years)'},
            'Income': {'min': 15000, 'max': 150000, 'default': 65000, 'mean': 80496.78, 'label': 'Annual Income ($)'},
            'LoanAmount': {'min': 5000, 'max': 250000, 'default': 50000, 'mean': 131892.76, 'label': 'Loan Amount ($)'},
            'CreditScore': {'min': 300, 'max': 850, 'default': 680, 'mean': 561.99, 'label': 'Credit Score (FICO)'},
            'MonthsEmployed': {'min': 0, 'max': 120, 'default': 36, 'mean': 58.76, 'label': 'Months Employed'},
            'NumCreditLines': {'min': 1, 'max': 4, 'default': 2, 'mean': 2.41, 'label': 'Credit Lines'},
            'InterestRate': {'min': 1.0, 'max': 25.0, 'default': 8.5, 'mean': 13.47, 'label': 'Interest Rate (%)'},
            'LoanTerm': {'min': 12, 'max': 60, 'default': 36, 'mean': 36.36, 'label': 'Loan Term (Months)'},
            'DTIRatio': {'min': 0.05, 'max': 0.95, 'default': 0.35, 'mean': 0.48, 'label': 'Debt-to-Income (DTI) Ratio'}
        },
        'categorical_options': {
            'Education': ['High School', 'Bachelor', 'Master', 'PhD'],
            'EmploymentType': ['Full-time', 'Part-time', 'Self-employed', 'Unemployed'],
            'MaritalStatus': ['Single', 'Married', 'Divorced'],
            'LoanPurpose': ['Auto', 'Business', 'Education', 'Home', 'Other'],
            'HasMortgage': ['No', 'Yes'],
            'HasDependents': ['No', 'Yes'],
            'HasCoSigner': ['No', 'Yes']
        }
    }
    
    with open('backend/model_metadata.json', 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
        
    print('Model exported successfully to backend/loan_model.joblib and backend/model_metadata.json')

if __name__ == '__main__':
    train_and_export()
