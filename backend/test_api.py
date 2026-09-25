from backend.app import app as flask_app
client = flask_app.test_client()
res = client.get('/api/health')
print('Health:', res.json)
samples = client.get('/api/samples').json
for s in samples:
    pred = client.post('/api/predict', json=s['data']).json
    print(f"[{s['name']}] Probability: {pred['default_probability']}%, Tier: {pred['risk_tier']}, Decision: {pred['decision']}")
