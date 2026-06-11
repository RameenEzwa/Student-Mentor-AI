# AI Student Performance Assistant

> A Python-based, menu-driven AI assistant that analyses student data, predicts academic performance using machine learning, and provides personalised study recommendations — in support of **UN SDG 4: Quality Education**.

---

## SDG 4 — Quality Education

**Sustainable Development Goal 4** aims to ensure inclusive and equitable quality education and promote lifelong learning opportunities for all. This project directly supports SDG 4 by:

- Identifying **at-risk students** early so educators can intervene
- Providing **data-driven study recommendations** tailored to each learner
- Using **machine learning** to predict outcomes and guide improvement
- Making educational analytics **accessible and beginner-friendly**

---

## Dataset

**Source:** Kaggle — [Student Performance Factors](https://www.kaggle.com/datasets/lainguyn123/student-performance-factors)

**File:** `StudentPerformanceFactors.csv`

**Size:** ~6,600 student records with 20 features including:

| Feature | Description |
|---|---|
| `Hours_Studied` | Weekly study hours |
| `Attendance` | Attendance percentage |
| `Parental_Involvement` | Low / Medium / High |
| `Access_to_Resources` | Low / Medium / High |
| `Sleep_Hours` | Average sleep per night |
| `Previous_Scores` | Score from previous exams |
| `Motivation_Level` | Low / Medium / High |
| `Tutoring_Sessions` | Number of tutoring sessions per month |
| `Exam_Score` | Final exam score (target variable) |
| *(and 11 more…)* | |

---

## Features

| Menu Option | Description |
|---|---|
| **1. Dataset Summary** | Total records, column types, and descriptive statistics |
| **2. Average Scores** | Breakdown of average scores by key factors (parental involvement, school type, etc.) |
| **3. Weak Students** | Lists at-risk students (score < 60) with their study habits |
| **4. Predict from Hours** | Enter study hours → get a predicted exam score |
| **5. Study Recommendations** | Personalised advice based on your study habits, attendance, and sleep |
| **6. Charts & Graphs** | 6 charts saved to the `charts/` folder (distribution, scatter, pie, feature importance) |
| **7. Full AI Prediction** | Enter full student profile → ML model predicts score and performance category |

### Machine Learning Models

- **Linear Regression** — predicts numeric exam score from study habits
- **Random Forest Classifier** — categorises performance as *Low*, *Medium*, or *High*
- Features used: `Hours_Studied`, `Attendance`, `Sleep_Hours`, `Previous_Scores`, `Tutoring_Sessions`, `Physical_Activity`

---

## Project Structure

```
ai-student-assistant/
├── app.py                        # Main application
├── requirements.txt              # Python dependencies
├── README.md                     # This file
├── StudentPerformanceFactors.csv # Dataset (must be present)
└── charts/                       # Auto-created — chart images saved here
    ├── 1_score_distribution.png
    ├── 2_hours_vs_score.png
    ├── 3_parental_involvement.png
    ├── 4_attendance_vs_score.png
    ├── 5_performance_pie.png
    └── 6_feature_importance.png
```

---

## How to Run

### On Replit

1. Make sure `StudentPerformanceFactors.csv` is in the **same folder** as `app.py`
2. Open the Shell and run:

```bash
pip install -r requirements.txt
python app.py
```

3. Follow the on-screen menu (type a number and press Enter)

### On Your Local Machine

```bash
# 1. Clone or download the project
cd ai-student-assistant

# 2. (Optional) Create a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

> **Python version:** 3.8 or higher is required.

---

## Example Session

```
============================================================
       AI STUDENT PERFORMANCE ASSISTANT
       Powered by Machine Learning | SDG 4: Quality Education
============================================================

  Starting up...
[OK] Dataset loaded successfully! (6607 student records found)
[OK] Models trained!
     Regression  RMSE  : 3.42 points
     Classifier Accuracy: 74.3%

  Choose an option:
  ─────────────────────────────────────────────────────────
  [1]  View dataset summary
  [2]  Show average student scores
  [3]  Detect weak-performing students
  [4]  Predict score from study hours
  [5]  Get personalised study recommendations
  [6]  Show graphs and charts
  [7]  Full AI performance prediction
  [0]  Exit
```

---

## Requirements

```
pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
scikit-learn>=1.3.0
```

---

## Academic Context

This project was developed as a university assignment demonstrating:

- **Data Science** — loading, cleaning, and exploring a real-world dataset with pandas
- **Data Visualisation** — generating meaningful charts with matplotlib
- **Machine Learning** — training regression and classification models with scikit-learn
- **Software Engineering** — modular, well-commented, menu-driven Python code
- **Social Impact** — alignment with the United Nations Sustainable Development Goals

---

## License

This project is open-source and free to use for educational purposes.

Dataset credit: [Kaggle — Student Performance Factors by lainguyn123](https://www.kaggle.com/datasets/lainguyn123/student-performance-factors)
