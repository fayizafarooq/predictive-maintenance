"""
daily_predict.py — Predictive Maintenance Daily Batch Script (v2)
=================================================================

This script tracks 30 FIXED machines over time.
Each machine has a realistic deterioration pattern, where its sensor readings gradually worsen until the machine reaches High Risk.

Run this script once per day. It will:
  1. Load or create the 30 fixed machines with their current health state
  2. Update each machine's sensor readings (gradual deterioration)
  3. Predict failure risk using trained ML models
  4. Calculate health score, days to failure, and status changes
  5. Append today's readings to the historical CSV (for Power BI)
  6. Save today's readings to SQLite database (for traceability)
  7. Power BI refreshes automatically from the CSV

Usage:
    python daily_predict.py
"""

import pandas as pd
import numpy as np
from datetime import date, timedelta
import os
import sqlite3
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# Configuration ─────────────────────────────────────────────────────────────
PREDICTIONS_FILE = 'equipment_failure_predictions.csv'
MACHINE_STATE_FILE = 'machine_states.csv'  # tracks each machine's current state
NUM_MACHINES = 30
TRAINING_FILE = 'clean_machine_data.csv'
DATABASE_FILE = 'predictions.db'  # SQLite database for structured storage

# Step 1: Train ML models ───────────────────────────────────────────────────
print('Training ML models...')

base_df = pd.read_csv(TRAINING_FILE)
X = base_df.drop('failure', axis=1)
y = base_df['failure']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=X.columns)

log_model = LogisticRegression(max_iter=1000, random_state=42)
log_model.fit(X_train_scaled, y_train)

rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_scaled, y_train)

xgb_model = XGBClassifier(
    n_estimators=200, max_depth=5, learning_rate=0.1,
    eval_metric='logloss', random_state=42
)
xgb_model.fit(X_train_scaled, y_train)

print('Models trained!')

# Step 2: Load or create machine states ────────────────────────────────────
# Each machine has a "deterioration rate" — how fast it wears out
# and a "current state" — where it currently is in its lifecycle

if os.path.exists(MACHINE_STATE_FILE):
    states = pd.read_csv(MACHINE_STATE_FILE)
    print(f'Loaded existing machine states for {len(states)} machines.')
else:
    print('Creating 30 fixed machines with initial states...')
    np.random.seed(42)

    machine_ids = [f'M{str(i+1).zfill(3)}' for i in range(NUM_MACHINES)]

    # Each machine starts at a different point in its lifecycle
    # so they don't all fail at the same time
    states = pd.DataFrame({
        'machine_id': machine_ids,

        # Base sensor values — each machine is slightly different
        'base_temperature': np.random.normal(65, 5, NUM_MACHINES),
        'base_vibration': np.random.normal(0.40, 0.05, NUM_MACHINES),
        'base_pressure': np.random.normal(28, 3, NUM_MACHINES),

        # Current sensor values — start at base
        'current_temperature': np.random.normal(65, 5, NUM_MACHINES),
        'current_vibration': np.random.normal(0.40, 0.05, NUM_MACHINES),
        'current_pressure': np.random.normal(28, 3, NUM_MACHINES),
        'current_operating_hours': np.random.randint(200, 3000, NUM_MACHINES),

        # Deterioration rate — how fast each machine degrades
        # higher = faster deterioration
        'deterioration_rate': np.random.uniform(0.3, 1.5, NUM_MACHINES),

        # Days since last maintenance — machines due for maintenance degrade faster
        'days_since_maintenance': np.random.randint(0, 90, NUM_MACHINES),

        # Previous risk level — to detect status changes
        'previous_risk': np.random.choice(['Low Risk', 'Low Risk', 'Medium Risk'], NUM_MACHINES),

        # Health score — starts between 60-100
        'health_score': np.random.uniform(60, 100, NUM_MACHINES),
    })

    states.to_csv(MACHINE_STATE_FILE, index=False)
    print('Machine states created!')

# Step 3: Update machine states for today ───────────────────────────────────
print(f'\nUpdating machine states for {date.today()}...')

np.random.seed(int(date.today().strftime('%Y%m%d')))  # different randomness each day

maintained_today = []  # track machines maintained today

for idx in states.index:
    rate = states.loc[idx, 'deterioration_rate']

    # Gradually increase sensor readings based on deterioration rate
    # Small daily increase + random noise
    states.loc[idx, 'current_temperature'] += rate * np.random.uniform(0.1, 0.4)
    states.loc[idx, 'current_vibration'] += rate * np.random.uniform(0.002, 0.008)
    states.loc[idx, 'current_pressure'] += rate * np.random.uniform(0.05, 0.2)
    states.loc[idx, 'current_operating_hours'] += np.random.randint(6, 12)  # 6-12 hours per day
    states.loc[idx, 'days_since_maintenance'] += 1

    # If machine reaches critical levels, simulate maintenance reset (some chance)
    # 10% chance of maintenance if health is very low
    if states.loc[idx, 'health_score'] < 20 and np.random.random() < 0.10:
        maintained_today.append(states.loc[idx, 'machine_id'])
        print(f"  ⚙️  Maintenance performed on {states.loc[idx, 'machine_id']}!")
        states.loc[idx, 'current_temperature'] = states.loc[idx, 'base_temperature']
        states.loc[idx, 'current_vibration'] = states.loc[idx, 'base_vibration']
        states.loc[idx, 'current_pressure'] = states.loc[idx, 'base_pressure']
        states.loc[idx, 'days_since_maintenance'] = 0
        states.loc[idx, 'health_score'] = np.random.uniform(75, 100)

# Step 4: Generate predictions for today ────────────────────────────────────
today_features = pd.DataFrame({
    'temperature': states['current_temperature'],
    'vibration': states['current_vibration'],
    'pressure': states['current_pressure'],
    'operating_hours': states['current_operating_hours'],
})

today_scaled = pd.DataFrame(scaler.transform(today_features), columns=X.columns)

# Predictions
log_preds = log_model.predict(today_scaled)
rf_preds = rf_model.predict(today_scaled)
xgb_preds = xgb_model.predict(today_scaled)

log_probs = log_model.predict_proba(today_scaled)[:, 1]
rf_probs = rf_model.predict_proba(today_scaled)[:, 1]
xgb_probs = xgb_model.predict_proba(today_scaled)[:, 1]

# Step 5: Calculate health score, risk, status change, days to failure ──────
def risk_category(prob):
    if prob < 0.3:
        return 'Low Risk'
    elif prob < 0.6:
        return 'Medium Risk'
    else:
        return 'High Risk'

risk_levels = [risk_category(p) for p in xgb_probs]

# Update health score — decreases as failure probability increases
for idx in states.index:
    prob = xgb_probs[idx]
    states.loc[idx, 'health_score'] = max(0, min(100, (1 - prob) * 100))

health_scores = states['health_score'].values

# Status change — did risk get worse since yesterday?
def status_change(prev, curr):
    order = {'Low Risk': 0, 'Medium Risk': 1, 'High Risk': 2}
    if order[curr] > order[prev]:
        return 'Deteriorating'
    elif order[curr] < order[prev]:
        return 'Improving'
    else:
        return 'Stable'

trends = [status_change(states.loc[i, 'previous_risk'], risk_levels[i])
        for i in states.index]

# Days to failure estimate — based on current health score and deterioration rate
def estimate_days_to_failure(health, rate):
    if health <= 0:
        return 0
    # Rough estimate: at current rate, how many days until health hits 0
    daily_health_loss = rate * 0.8
    if daily_health_loss <= 0:
        return 999
    return max(0, int(health / daily_health_loss))

days_to_failure = [
    estimate_days_to_failure(health_scores[i], states.loc[i, 'deterioration_rate'])
    for i in states.index
]

predicted_failure_date = [
    (date.today() + timedelta(days=d)).strftime('%Y-%m-%d') if d < 999 else 'No failure predicted'
    for d in days_to_failure
]

# Step 6: Build today's dataframe ──────────────────────────────────────────
today_df = pd.DataFrame({
    'date': date.today().strftime('%Y-%m-%d'),
    'machine_id': states['machine_id'],
    'temperature': states['current_temperature'].round(2),
    'vibration': states['current_vibration'].round(4),
    'pressure': states['current_pressure'].round(2),
    'operating_hours': states['current_operating_hours'],
    'days_since_maintenance': states['days_since_maintenance'],
    'log_prediction': log_preds,
    'rf_prediction': rf_preds,
    'xgb_prediction': xgb_preds,
    'log_failure_prob': log_probs.round(4),
    'rf_failure_prob': rf_probs.round(4),
    'xgb_failure_prob': xgb_probs.round(4),
    'failure_risk_level': risk_levels,
    'health_score': health_scores.round(1),
    'trend': trends,
    'days_to_failure': days_to_failure,
    'predicted_failure_date': predicted_failure_date,
})

# Step 7: Update previous risk in machine states ───────────────────────────
states['previous_risk'] = risk_levels
states.to_csv(MACHINE_STATE_FILE, index=False)

# Step 8: Append to historical CSV ─────────────────────────────────────────
if os.path.exists(PREDICTIONS_FILE):
    existing_df = pd.read_csv(PREDICTIONS_FILE)
    combined_df = pd.concat([existing_df, today_df], ignore_index=True)
else:
    combined_df = today_df

combined_df.to_csv(PREDICTIONS_FILE, index=False)

# Step 9: Save today's predictions to SQLite database ───────────────────────
# SQLite provides structured storage for traceability and audit purposes
# This runs alongside the CSV save — Power BI reads CSV, SQLite stores for records
try:
    conn = sqlite3.connect(DATABASE_FILE)

    # Append only today's new records to the database
    # if_exists='append' ensures we don't overwrite existing data
    today_df.to_sql('predictions', conn, if_exists='append', index=False)
    conn.commit()

    # Quick verification — show total records now in database
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM predictions')
    total_db_records = cursor.fetchone()[0]
    conn.close()
    print(f'Database updated: {total_db_records} total records in predictions.db')

except Exception as e:
    # If database doesn't exist yet, remind user to run setup_database.py first
    print(f'Database note: Run setup_database.py first to initialise the database.')
    print(f'  Error: {e}')

# Step 10: Print daily summary ───────────────────────────────────────────────
print(f'\n{"="*50}')
print(f'Daily Report — {date.today()}')
print(f'{"="*50}')
print(f"High Risk    : {risk_levels.count('High Risk')} machines")
print(f"Medium Risk  : {risk_levels.count('Medium Risk')} machines")
print(f"Low Risk     : {risk_levels.count('Low Risk')} machines")

deteriorating = [t for t in trends if t == 'Deteriorating']
print(f"\nMachines getting worse today: {len(deteriorating)}")

print(f'\nTop 5 most critical machines:')
top5 = today_df.nsmallest(5, 'days_to_failure')[
    ['machine_id', 'health_score', 'failure_risk_level', 'days_to_failure', 'predicted_failure_date']
]
print(top5.to_string(index=False))
print(f'\nTotal records in CSV: {len(combined_df)}')
print(f'CSV saved: {os.path.abspath(PREDICTIONS_FILE)}')

# Step 11: Generate at_risk_machines.json for website alerts page ───────────
import json

at_risk = today_df[
    (today_df['failure_risk_level'] == 'High Risk') |
    (today_df['trend'] == 'Deteriorating')
].sort_values('days_to_failure').copy()

at_risk_list = []
for _, row in at_risk.iterrows():
    at_risk_list.append({
        'machine_id'        : row['machine_id'],
        'failure_risk_level': row['failure_risk_level'],
        'health_score'      : round(float(row['health_score']), 1),
        'days_to_failure'   : int(row['days_to_failure']),
        'predicted_failure_date': row['predicted_failure_date'],
        'trend'             : row['trend'],
        'temperature'       : round(float(row['temperature']), 2),
        'vibration'         : round(float(row['vibration']), 4),
        'pressure'          : round(float(row['pressure']), 2),
    })

json_data = {
    'date'          : date.today().strftime('%Y-%m-%d'),
    'at_risk_count' : len(at_risk_list),
    'machines'      : at_risk_list,
    'maintained'    : maintained_today
}

JSON_FILE = '../docs/at_risk_machines.json'
with open(JSON_FILE, 'w') as f:
    json.dump(json_data, f, indent=2)

print(f'At-risk JSON saved: {os.path.abspath(JSON_FILE)} ({len(at_risk_list)} machines)')