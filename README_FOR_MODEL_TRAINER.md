# SIH PS-25017 — Land Acquisition Delay Prediction
## Model Training Dataset Handoff Package

---

## What's in This Package

```
sih_model_training_package/
├── README.md                       ← You are here
├── master_dataset.csv              ← ⭐ MAIN FILE — use this for training
├── data_dictionary.json            ← What each column means
│
├── individual_sources/             ← Source-wise breakdowns
│   ├── synthetic_training_data.csv
│   ├── landconflict_data.csv
│   ├── mospi_data.csv
│   ├── gazette_data.csv
│   └── kanoon_cases.csv
│
└── scripts/                        ← Reference scripts (optional)
    ├── generate_synthetic_data.py
    ├── build_master_dataset.py
    └── audit_data.py
```

---

## Quick Start (for the model trainer)

```python
import pandas as pd
import numpy as np

# Load master dataset
df = pd.read_csv('master_dataset.csv')
print(df.shape)  # (2476, 39)

# Target columns
# - is_delayed (int, 0 or 1)  ← Classification target
# - delay_days (int, ≥0)      ← Regression target

# Feature columns (all others except project_id, data_source, delay_score_raw)
FEATURES = [col for col in df.columns
            if col not in ['project_id', 'data_source', 'delay_score_raw',
                           'is_delayed', 'delay_days']]

X = df[FEATURES]
y_class = df['is_delayed']       # for delay risk classifier
y_reg   = df['delay_days']       # for delay duration predictor

print("Features:", len(FEATURES))
print("Class balance:", y_class.value_counts(normalize=True).round(2))
```

---

## Dataset Overview

| Property | Value |
|---|---|
| **Total rows** | 2,476 |
| **Feature columns** | 39 |
| **Label (is_delayed)** | 1 = Delayed, 0 = On-time |
| **Delay rate** | 69.5% delayed, 30.5% on-time |
| **States covered** | 16 Indian states |
| **Stages covered** | 0, 1, 4, 5, 6, 7, 9 |

### Data Sources
| Source | Rows | Type |
|---|---|---|
| Synthetic (RFCTLARR formulas) | 1,200 | Synthetic (domain-correct) |
| Indian Kanoon (High Court) | 365 | Extracted |
| Land Conflict Watch | 360 | Real documented |
| MoSPI Flash Reports | 296 | Real documented |
| eGazette Notices | 255 | Extracted |

---

## Column Reference

### ID & Meta Columns (DROP before training)
| Column | Type | Description |
|---|---|---|
| `project_id` | string | Unique ID — NOT a feature |
| `data_source` | string | Which source this row came from — NOT a feature |
| `delay_score_raw` | float | Internal scoring variable — NOT a feature |

### Categorical Features (encode with One-Hot or Label Encoding)
| Column | Values | Description |
|---|---|---|
| `current_stage` | 0,1,4,5,6,7,9 | Stage of RFCTLARR land acquisition process |
| `state` | 16 Indian states | State where project is |
| `district` | Various | District within state |
| `project_type` | Highway, Railway, Dam, Power Line, Urban Metro, Industrial Corridor, Irrigation Canal | Type of infrastructure project |
| `terrain_type` | Rural, Urban, Semi-Urban, Tribal, Forest | Land terrain |
| `land_ownership_type` | Private, Government, Forest, Tribal, Mixed | Who owns the land being acquired |

### Binary Features (already 0/1 — no encoding needed)
| Column | 0 = | 1 = |
|---|---|---|
| `tribal_area_flag` | Non-tribal area | Tribal/PESA/5th Schedule area |
| `election_year` | Non-election year | Election year (state or central) |
| `section_11_lapsed` | Sec11 valid | Sec11 12-month deadline lapsed |
| `section_19_issued` | Not issued | Section 19 Final Declaration issued |
| `hc_stay_active` | No stay order | Active High Court stay order |
| `budget_cut_flag` | No budget cut | Budget cut during acquisition |
| `officer_changed_since_start` | No change | Acquisition officer changed |

### Numeric Features
| Column | Unit | Description |
|---|---|---|
| `total_land_area_ha` | Hectares | Total land to be acquired |
| `num_affected_families` | Count | Families displaced |
| `structures_count` | Count | Structures/buildings on land |
| `project_budget_crore` | ₹ Crore | Total project budget |
| `month_of_initiation` | 1–12 | Month when acquisition started |
| `num_objections_filed` | Count | Objections filed under Sec15 |
| `objections_resolved` | Count | Objections resolved (NaN = unknown) |
| `sc_st_affected_count` | Count | SC/ST families affected |
| `days_in_objection_stage` | Days | Days spent in objection hearing stage |
| `days_to_lapse_deadline` | Days | Days until/since Section 11 12-month deadline (negative = past deadline) |
| `state_historical_lapse_rate` | 0–1 float | State's historical rate of Sec11 lapses |
| `compensation_disbursement_pct` | 0–100% | % of total compensation disbursed |
| `compensation_market_ratio` | 0.2–1.2 | Award amount as fraction of market value |
| `num_landowners_contested_award` | Count | Landowners who contested compensation in court |
| `days_award_to_payment` | Days | Days between award and actual payment |
| `possession_status_pct` | 0–100% | % of land physically possessed |
| `outstanding_court_cases` | Count | Active court cases |
| `days_since_award` | Days | Days since compensation award passed |
| `inter_dept_coord_score` | 1–10 | Inter-department coordination quality |
| `avg_officer_resolution_days` | Days | Avg days for officer to resolve issues |
| `historical_delay_score_district` | 0–1 | District's historical delay score |

### Target Columns
| Column | Type | Use For |
|---|---|---|
| `is_delayed` | int (0 or 1) | **Classification** — predict delay risk |
| `delay_days` | int (≥0) | **Regression** — predict delay duration in days |

---

## Recommended ML Approach

### Task 1 — Delay Risk Classifier
```python
from sklearn.model_selection import train_test_split, StratifiedKFold
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score

X_train, X_test, y_train, y_test = train_test_split(
    X, y_class, test_size=0.2, stratify=y_class, random_state=42)

model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=0.44,   # 30.5/69.5 to handle imbalance
    random_state=42
)
model.fit(X_train, y_train,
          eval_set=[(X_test, y_test)],
          verbose=False)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, model.predict_proba(X_test)[:,1]))
```

### Task 2 — Delay Duration Regressor
```python
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Only train on delayed projects for regression
delayed_mask = df['is_delayed'] == 1
X_reg = df.loc[delayed_mask, FEATURES]
y_reg_delayed = df.loc[delayed_mask, 'delay_days']

X_tr, X_te, y_tr, y_te = train_test_split(X_reg, y_reg_delayed,
                                           test_size=0.2, random_state=42)
reg = XGBRegressor(n_estimators=200, max_depth=5, learning_rate=0.05)
reg.fit(X_tr, y_tr)
print("MAE:", mean_absolute_error(y_te, reg.predict(X_te)), "days")
print("R2 :", r2_score(y_te, reg.predict(X_te)))
```

### Preprocessing Steps Required
```python
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer

# 1. Drop non-feature columns
df_train = df.drop(columns=['project_id', 'data_source', 'delay_score_raw'])

# 2. One-hot encode categoricals
cat_cols = ['state', 'project_type', 'terrain_type', 'land_ownership_type']
df_train = pd.get_dummies(df_train, columns=cat_cols)

# 3. Encode current_stage as categorical (not ordinal)
df_train = pd.get_dummies(df_train, columns=['current_stage'],
                          prefix='stage')

# 4. Impute missing values (objections_resolved, delay_score_raw have 14.5% nulls)
imputer = SimpleImputer(strategy='median')
numeric_cols = df_train.select_dtypes(include='number').columns.difference(
    ['is_delayed', 'delay_days'])
df_train[numeric_cols] = imputer.fit_transform(df_train[numeric_cols])
```

---

## Data Quality Notes

- ✅ **Zero duplicate rows** in all files
- ✅ **All range checks pass** (compensation 0-100%, stages in {0,1,4,5,6,7,9}, etc.)
- ✅ **Logical consistency fixed** — `section_11_lapsed` and `section_19_issued` are never both 1
- ✅ **Outliers capped** at 99th percentile for numeric columns
- ⚠️ **Stages 0, 1, 4** are covered only by synthetic data (no public datasets exist for early stages)
- ⚠️ **Kanoon source** has 95.9% delay rate (expected — Stage 9 = HC litigation = always delayed)
- ⚠️ **`objections_resolved` and `delay_score_raw`** have ~14.5% nulls — use median imputation

---

## Contact

SIH PS-25017 Team  
Problem: Land Acquisition Delay Prediction System  
Stages in scope: 0, 1, 4, 5, 6, 7, 9
