# predictive-maintenance

A machine learning-based predictive maintenance system that monitors 30 industrial 
machines, predicts equipment failures before they occur, and visualises results 
through an interactive Power BI dashboard embedded in a secure web application.

---

## 🔗 Live Demo
[View Live Dashboard](https://fayizafarooq.github.io/predictive-maintenance/)

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 📋 Project Overview
This system applies supervised machine learning to predict equipment failure risk 
using sensor data including temperature, vibration, pressure and operating hours. 
The project follows the CRISP-DM methodology across all development phases from 
data understanding through to deployment.

---

## ⚙️ Technologies Used
- Python (Pandas, Scikit-learn, XGBoost)
- Jupyter Notebook
- Microsoft Power BI
- SQLite
- HTML / CSS / JavaScript
- GitHub Pages

---

## 🤖 Machine Learning Models
| Model | Accuracy | Recall |
|-------|----------|--------|
| Logistic Regression | 62.3% | 77.8% |
| Random Forest | 57.7% | 71.3% |
| XGBoost | 61.7% | 92.2% |

XGBoost was selected as the primary production model due to its superior recall 
of 92.2% — in a maintenance context, detecting real failures is more important 
than overall accuracy.

---

## 📁 Project Structure
notebooks/
├── 01_data_understanding.ipynb    ← Data generation and exploration
├── 02_data_preparation.ipynb      ← Preprocessing and feature scaling
├── 03_modeling.ipynb              ← Model training and comparison
├── 04_evaluation.ipynb            ← Model evaluation and tuning
├── daily_predict.py               ← Daily prediction script
├── historical_data.py             ← Historical data generation
├── setup_database.py              ← Database initialisation
├── clean_machine_data.csv         ← ML training dataset (1,500 rows)
├── equipment_failure_predictions.csv ← Power BI data source
├── machine_states.csv             ← Machine state memory
├── predictions.db                 ← SQLite database
└── Maintenance_dashboard.pbix     ← Power BI dashboard file

---


## 📊 Dashboard Features
**Page 1 — Fleet Overview:**
- Risk count cards (High/Medium/Low Risk)
- KPI indicators with targets
- Machines Needing Attention bar chart
- Fleet Status Overview table
- Daily Risk Trend line chart
- Overall Fleet Health gauge
- Risk Level Distribution donut chart

**Page 2 — Machine Health Details:**
- Individual machine selector
- Health Score Over Time chart
- Sensor Readings chart
- Machine History Log table

---

## 🌐 Web Application Features
- Secure login page with authentication
- Embedded live Power BI dashboard
- Fleet Overview and Machine Details pages
- About page with project information
- Responsive dark navy theme

---

## 👩‍💻 Student
**Name:** Fayiza Farooq  

---

## 📝 Note on Data
Synthetic data was used in this project due to the unavailability of proprietary 
sensor data. The dataset was designed with realistic 
failure logic using a sigmoid function to closely simulate actual industrial 
equipment behaviour.
