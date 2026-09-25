import os
import json
import joblib
import numpy as np
from flask import Flask, request, jsonify, make_response, send_from_directory

# Serve static frontend build if present
DIST_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend/dist'))
app = Flask(__name__, static_folder=DIST_FOLDER if os.path.exists(DIST_FOLDER) else None, static_url_path='')

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, 'loan_model.joblib')
SCALER_PATH = os.path.join(BASE_DIR, 'loan_scaler.joblib')
META_PATH = os.path.join(BASE_DIR, 'model_metadata.json')

model = None
scaler = None
metadata = {}

if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH) and os.path.exists(META_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    with open(META_PATH, 'r', encoding='utf-8') as f:
        metadata = json.load(f)

def encode_input(data):
    feature_names = metadata.get('features', [])
    row = {f: 0.0 for f in feature_names}

    row['Age'] = float(data.get('Age', 35))
    row['Income'] = float(data.get('Income', 65000))
    row['LoanAmount'] = float(data.get('LoanAmount', 50000))
    row['CreditScore'] = float(data.get('CreditScore', 680))
    row['MonthsEmployed'] = float(data.get('MonthsEmployed', 36))
    row['NumCreditLines'] = float(data.get('NumCreditLines', 2))
    row['InterestRate'] = float(data.get('InterestRate', 8.5))
    row['LoanTerm'] = float(data.get('LoanTerm', 36))
    row['DTIRatio'] = float(data.get('DTIRatio', 0.35))

    for b in ['HasMortgage', 'HasDependents', 'HasCoSigner']:
        val = data.get(b, 'No')
        row[b] = 1.0 if (val == 1 or str(val).lower() in ['yes', 'true', '1']) else 0.0

    edu = data.get('Education', "Bachelor's")
    if f'Education_{edu}' in row:
        row[f'Education_{edu}'] = 1.0

    emp = data.get('EmploymentType', 'Full-time')
    if f'EmploymentType_{emp}' in row:
        row[f'EmploymentType_{emp}'] = 1.0

    mar = data.get('MaritalStatus', 'Single')
    if f'MaritalStatus_{mar}' in row:
        row[f'MaritalStatus_{mar}'] = 1.0

    purp = data.get('LoanPurpose', 'Auto')
    if f'LoanPurpose_{purp}' in row:
        row[f'LoanPurpose_{purp}'] = 1.0

    feature_vector = [row[f] for f in feature_names]
    return np.array([feature_vector]), row

@app.route('/api', methods=['GET'])
@app.route('/api/', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_type': metadata.get('model_type', 'Logistic Regression')
    })

@app.route('/api/model-info', methods=['GET'])
def model_info():
    return jsonify(metadata)

@app.route('/api/samples', methods=['GET'])
def samples():
    sample_profiles = [
        {
            'id': 'low-risk',
            'name': 'Prime Borrower (Low Risk)',
            'description': 'High income, high credit score, low DTI, stable full-time employment.',
            'data': {
                'Age': 48,
                'Income': 125000,
                'LoanAmount': 35000,
                'CreditScore': 780,
                'MonthsEmployed': 84,
                'NumCreditLines': 2,
                'InterestRate': 4.5,
                'LoanTerm': 36,
                'DTIRatio': 0.22,
                'Education': "Master's",
                'EmploymentType': 'Full-time',
                'MaritalStatus': 'Married',
                'LoanPurpose': 'Home',
                'HasMortgage': 'Yes',
                'HasDependents': 'No',
                'HasCoSigner': 'Yes'
            }
        },
        {
            'id': 'moderate-risk',
            'name': 'Mid-Tier Applicant (Moderate Risk)',
            'description': 'Moderate income, average credit score, mid DTI ratio.',
            'data': {
                'Age': 34,
                'Income': 62000,
                'LoanAmount': 85000,
                'CreditScore': 580,
                'MonthsEmployed': 36,
                'NumCreditLines': 3,
                'InterestRate': 12.0,
                'LoanTerm': 48,
                'DTIRatio': 0.45,
                'Education': "Bachelor's",
                'EmploymentType': 'Full-time',
                'MaritalStatus': 'Single',
                'LoanPurpose': 'Auto',
                'HasMortgage': 'No',
                'HasDependents': 'Yes',
                'HasCoSigner': 'No'
            }
        },
        {
            'id': 'high-risk',
            'name': 'Subprime Applicant (High Risk)',
            'description': 'High loan amount, low credit score, high DTI ratio.',
            'data': {
                'Age': 24,
                'Income': 24000,
                'LoanAmount': 180000,
                'CreditScore': 380,
                'MonthsEmployed': 6,
                'NumCreditLines': 4,
                'InterestRate': 21.5,
                'LoanTerm': 60,
                'DTIRatio': 0.82,
                'Education': 'High School',
                'EmploymentType': 'Unemployed',
                'MaritalStatus': 'Single',
                'LoanPurpose': 'Business',
                'HasMortgage': 'No',
                'HasDependents': 'Yes',
                'HasCoSigner': 'No'
            }
        }
    ]
    return jsonify(sample_profiles)

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return make_response('', 204)
    try:
        data = request.json or {}
        vec, encoded_row = encode_input(data)
        vec_scaled = scaler.transform(vec)
        prob_default = float(model.predict_proba(vec_scaled)[0][1])
        prediction = int(prob_default >= 0.5)

        feature_names = metadata.get('features', [])
        coefficients = model.coef_[0]
        intercept = float(model.intercept_[0])

        contributions = []
        scaled_values = vec_scaled[0]
        for name, coef, scaled_val in zip(feature_names, coefficients, scaled_values):
            impact = float(coef * scaled_val)
            contributions.append({
                'feature': name,
                'raw_value': encoded_row.get(name, 0.0),
                'scaled_value': float(scaled_val),
                'coefficient': float(coef),
                'impact': impact,
                'direction': 'increases_risk' if impact > 0 else 'decreases_risk'
            })
        contributions.sort(key=lambda x: abs(x['impact']), reverse=True)

        if prob_default < 0.20:
            risk_tier = 'Low Risk (Prime)'
            decision = 'Recommended for Immediate Approval'
            badge_color = 'emerald'
        elif prob_default < 0.50:
            risk_tier = 'Moderate Risk'
            decision = 'Conditional Approval / Manual Underwriting Review'
            badge_color = 'amber'
        else:
            risk_tier = 'High Risk (Subprime)'
            decision = 'High Default Risk - Decline or Require Additional Collateral'
            badge_color = 'rose'

        loan_amount = float(data.get('LoanAmount', 50000))
        rate_annual = float(data.get('InterestRate', 8.5))
        term_months = int(data.get('LoanTerm', 36))
        r = (rate_annual / 100.0) / 12.0
        emi = (loan_amount * r * ((1 + r) ** term_months)) / (((1 + r) ** term_months) - 1) if (r > 0 and term_months > 0) else (loan_amount / max(1, term_months))
        monthly_income = float(data.get('Income', 65000)) / 12.0
        emi_to_income = (emi / monthly_income) if monthly_income > 0 else 1.0

        return jsonify({
            'success': True,
            'default_probability': round(prob_default * 100, 2),
            'prediction': prediction,
            'prediction_label': 'Default' if prediction == 1 else 'Non-Default',
            'risk_tier': risk_tier,
            'decision': decision,
            'badge_color': badge_color,
            'estimated_monthly_payment': round(emi, 2),
            'emi_to_income_ratio': round(emi_to_income * 100, 2),
            'intercept': intercept,
            'top_risk_factors': contributions[:8],
            'model_accuracy': metadata.get('metrics', {}).get('accuracy', 0.885)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Route for serving React single-page app (SPA) fallback
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != '' and app.static_folder and os.path.isfile(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({'status': 'Flask Backend Live', 'message': 'API is active. Build frontend dist to view UI.'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f'Starting Flask ML backend on port {port}')
    app.run(host='0.0.0.0', port=port, debug=False)
