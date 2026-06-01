import streamlit as st
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

st.set_page_config(
    page_title="AI Student Performance Assistant",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="collapsed"
)

st.markdown("""
<style>
    /* Global resets */
    .block-container { padding: 0 2rem 2rem 2rem !important; max-width: 100% !important; }
    #MainMenu, footer, header { visibility: hidden; }

    /* Top header bar */
    .app-header {
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #3730a3 100%);
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: -1rem -2rem 1.5rem -2rem;
        box-shadow: 0 4px 16px rgba(49,46,129,0.18);
    }
    .app-header-left { display: flex; align-items: center; gap: 0.75rem; }
    .app-header-logo {
        width: 40px; height: 40px; background: rgba(255,255,255,0.15);
        border-radius: 10px; display: flex; align-items: center;
        justify-content: center; font-size: 1.2rem;
        border: 1px solid rgba(255,255,255,0.25);
    }
    .app-header-title { color: white; font-size: 1.2rem; font-weight: 700; letter-spacing: -0.02em; }
    .app-header-subtitle { color: rgba(255,255,255,0.65); font-size: 0.78rem; margin-top: 1px; }
    .role-badge {
        background: rgba(255,255,255,0.15); color: white;
        padding: 0.35rem 0.9rem; border-radius: 50px;
        font-size: 0.8rem; font-weight: 600;
        border: 1px solid rgba(255,255,255,0.25);
        backdrop-filter: blur(4px);
    }

    /* Section header */
    .section-header { margin-bottom: 0.25rem; }
    .section-title { font-size: 1.25rem; font-weight: 700; color: #1e1b4b; margin: 0; }
    .section-subtitle { color: #6b7280; font-size: 0.85rem; margin: 0.2rem 0 1.25rem 0; }

    /* Metric cards row */
    .metrics-row {
        display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;
    }
    .metric-card {
        flex: 1; min-width: 140px;
        background: white;
        border: 1.5px solid #e5e7eb;
        border-radius: 12px;
        padding: 1rem 1.2rem;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .metric-label { font-size: 0.72rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
    .metric-value { font-size: 1.6rem; font-weight: 800; color: #1e1b4b; margin: 0.15rem 0; line-height: 1; }
    .metric-sub { font-size: 0.73rem; color: #6b7280; }
    .metric-accent { border-left: 4px solid #3730a3; }
    .metric-green  { border-left: 4px solid #10b981; }
    .metric-amber  { border-left: 4px solid #f59e0b; }
    .metric-red    { border-left: 4px solid #ef4444; }

    /* Chart card */
    .chart-card {
        background: white; border: 1.5px solid #e5e7eb;
        border-radius: 14px; padding: 1.2rem 1.4rem;
        box-shadow: 0 1px 6px rgba(0,0,0,0.06);
        margin-bottom: 1rem;
    }
    .chart-card-title {
        font-size: 0.9rem; font-weight: 700; color: #1e1b4b;
        margin: 0 0 0.2rem 0;
    }
    .chart-card-sub { font-size: 0.75rem; color: #9ca3af; margin: 0 0 0.6rem 0; }

    /* Table styling */
    .risk-table-wrap {
        background: white; border: 1.5px solid #e5e7eb;
        border-radius: 14px; overflow: hidden;
        box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    }
    .risk-header {
        background: #f8f7ff; padding: 1rem 1.4rem;
        border-bottom: 1.5px solid #e5e7eb;
        display: flex; align-items: center; justify-content: space-between;
    }
    .risk-header-title { font-size: 0.9rem; font-weight: 700; color: #1e1b4b; }
    .badge-risk {
        display: inline-block; padding: 0.2rem 0.65rem;
        border-radius: 50px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.02em;
    }
    .badge-high   { background: #fee2e2; color: #b91c1c; }
    .badge-medium { background: #fef3c7; color: #92400e; }

    /* Tab overrides */
    .stTabs [data-baseweb="tab-list"] {
        gap: 0.25rem;
        background: #f1f0fa;
        border-radius: 12px;
        padding: 0.3rem;
        margin-bottom: 1.5rem;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 9px; padding: 0.5rem 1.1rem;
        font-size: 0.85rem; font-weight: 600; color: #6b7280;
        background: transparent; border: none;
    }
    .stTabs [aria-selected="true"] {
        background: white !important; color: #3730a3 !important;
        box-shadow: 0 1px 4px rgba(55,48,163,0.12) !important;
    }
    .stTabs [data-baseweb="tab-border"] { display: none !important; }

    /* Search / filter inputs */
    .stTextInput input, .stSelectbox select {
        border: 1.5px solid #e5e7eb !important;
        border-radius: 9px !important;
        font-size: 0.85rem !important;
    }
    .stTextInput input:focus, .stSelectbox select:focus {
        border-color: #3730a3 !important;
        box-shadow: 0 0 0 3px rgba(55,48,163,0.1) !important;
    }
    div[data-testid="stDataFrame"] {
        border-radius: 0 0 14px 14px;
        overflow: hidden;
    }
</style>
""", unsafe_allow_html=True)

# ── Header ──────────────────────────────────────────────────────────────────
st.markdown("""
<div class="app-header">
  <div class="app-header-left">
    <div class="app-header-logo">🎓</div>
    <div>
      <div class="app-header-title">AI Student Performance Assistant</div>
      <div class="app-header-subtitle">Educational Analytics Platform · 6,607 Student Records</div>
    </div>
  </div>
  <div><span class="role-badge">👤 Teacher &amp; School Admin</span></div>
</div>
""", unsafe_allow_html=True)

# ── Metric Cards ─────────────────────────────────────────────────────────────
st.markdown("""
<div class="metrics-row">
  <div class="metric-card metric-accent">
    <div class="metric-label">Total Students</div>
    <div class="metric-value">6,607</div>
    <div class="metric-sub">Active records</div>
  </div>
  <div class="metric-card metric-green">
    <div class="metric-label">Class Average</div>
    <div class="metric-value">67.2</div>
    <div class="metric-sub">Exam score mean</div>
  </div>
  <div class="metric-card metric-amber">
    <div class="metric-label">At-Risk Students</div>
    <div class="metric-value">68</div>
    <div class="metric-sub">Score &lt;60 or attendance &lt;70%</div>
  </div>
  <div class="metric-card metric-red">
    <div class="metric-label">High Risk</div>
    <div class="metric-value">24</div>
    <div class="metric-sub">Multiple risk factors</div>
  </div>
  <div class="metric-card" style="border-left:4px solid #6366f1">
    <div class="metric-label">Avg Attendance</div>
    <div class="metric-value">83.4%</div>
    <div class="metric-sub">School-wide</div>
  </div>
</div>
""", unsafe_allow_html=True)

# ── Seed data ────────────────────────────────────────────────────────────────
rng = np.random.default_rng(42)

N = 6607
scores_medium = rng.uniform(60, 74, int(N * 0.971)).tolist()
scores_high   = rng.uniform(75, 98, int(N * 0.0188)).tolist()
scores_low    = rng.uniform(35, 59, int(N * 0.0103)).tolist()
all_scores = np.array(scores_medium + scores_high + scores_low)
rng.shuffle(all_scores)

study_hours = rng.uniform(1, 20, N)
score_from_study = 55 + study_hours * 0.85 + rng.normal(0, 4, N)
score_from_study = np.clip(score_from_study, 30, 99)

# ── Tabs ──────────────────────────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs([
    "📈  Charts & Distributions",
    "⚠️  At-Risk Tracker",
    "🔍  Factor Comparisons"
])

# ═════════════════════════════════════════════════════════════════════════════
# TAB 1: Charts & Distributions
# ═════════════════════════════════════════════════════════════════════════════
with tab1:
    st.markdown('<div class="section-header">'
                '<p class="section-title">📈 Charts &amp; Distributions</p>'
                '<p class="section-subtitle">Score distributions, study hours correlation, and performance categories.</p>'
                '</div>', unsafe_allow_html=True)

    INDIGO      = "#3730a3"
    INDIGO_LIGHT = "#818cf8"
    INDIGO_MID  = "#4f46e5"
    AMBER       = "#f59e0b"
    EMERALD     = "#10b981"
    ROSE        = "#ef4444"

    CHART_BG    = "white"
    GRID_COLOR  = "#f0f0f7"
    FONT_COLOR  = "#374151"

    col_a, col_b = st.columns(2, gap="medium")

    # ── Chart A: Exam Score Distribution ─────────────────────────────────────
    with col_a:
        st.markdown('<div class="chart-card">'
                    '<p class="chart-card-title">Exam Score Distribution</p>'
                    '<p class="chart-card-sub">6,607 student exam scores · Mean: 67.2</p>',
                    unsafe_allow_html=True)
        fig_a = go.Figure()
        fig_a.add_trace(go.Histogram(
            x=all_scores,
            nbinsx=30,
            marker_color=INDIGO,
            marker_line_color="white",
            marker_line_width=0.6,
            opacity=0.88,
            name="Students",
            hovertemplate="Score range: %{x}<br>Count: %{y}<extra></extra>"
        ))
        fig_a.add_vline(
            x=67.2, line_dash="dash", line_color=ROSE, line_width=1.8,
            annotation_text="Mean 67.2", annotation_position="top right",
            annotation_font_color=ROSE, annotation_font_size=11
        )
        fig_a.update_layout(
            height=280, margin=dict(l=10, r=10, t=10, b=10),
            paper_bgcolor=CHART_BG, plot_bgcolor=CHART_BG,
            font=dict(family="Inter, sans-serif", color=FONT_COLOR, size=11),
            xaxis=dict(title="Exam Score", gridcolor=GRID_COLOR, showgrid=True,
                       zeroline=False, title_font_size=11),
            yaxis=dict(title="Number of Students", gridcolor=GRID_COLOR,
                       showgrid=True, zeroline=False, title_font_size=11),
            showlegend=False, bargap=0.04
        )
        st.plotly_chart(fig_a, use_container_width=True, config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)

    # ── Chart B: Study Hours vs Exam Score ───────────────────────────────────
    with col_b:
        st.markdown('<div class="chart-card">'
                    '<p class="chart-card-title">Study Hours vs Exam Score</p>'
                    '<p class="chart-card-sub">Weekly study hours correlation · r = 0.74</p>',
                    unsafe_allow_html=True)
        sample_idx = rng.choice(N, 500, replace=False)
        fig_b = go.Figure()
        fig_b.add_trace(go.Scatter(
            x=study_hours[sample_idx],
            y=score_from_study[sample_idx],
            mode="markers",
            marker=dict(
                color=score_from_study[sample_idx],
                colorscale=[[0, "#c7d2fe"], [0.5, INDIGO_MID], [1, "#1e1b4b"]],
                size=5, opacity=0.7,
                line=dict(width=0)
            ),
            hovertemplate="Study hrs: %{x:.1f}<br>Score: %{y:.1f}<extra></extra>"
        ))
        trend_x = np.linspace(1, 20, 80)
        trend_y = 55 + trend_x * 0.85
        fig_b.add_trace(go.Scatter(
            x=trend_x, y=trend_y, mode="lines",
            line=dict(color=ROSE, width=2, dash="dot"),
            name="Trend", hoverinfo="skip"
        ))
        fig_b.update_layout(
            height=280, margin=dict(l=10, r=10, t=10, b=10),
            paper_bgcolor=CHART_BG, plot_bgcolor=CHART_BG,
            font=dict(family="Inter, sans-serif", color=FONT_COLOR, size=11),
            xaxis=dict(title="Weekly Study Hours", gridcolor=GRID_COLOR,
                       showgrid=True, zeroline=False, title_font_size=11),
            yaxis=dict(title="Exam Score", gridcolor=GRID_COLOR,
                       showgrid=True, zeroline=False, title_font_size=11),
            showlegend=False
        )
        st.plotly_chart(fig_b, use_container_width=True, config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)

    col_c, col_d = st.columns(2, gap="medium")

    # ── Chart C: Performance Category Breakdown ───────────────────────────────
    with col_c:
        st.markdown('<div class="chart-card">'
                    '<p class="chart-card-title">Performance Category Breakdown</p>'
                    '<p class="chart-card-sub">Based on exam score thresholds (Low &lt;60 · Medium 60–74 · High 75+)</p>',
                    unsafe_allow_html=True)
        fig_c = go.Figure(go.Pie(
            labels=["Medium (60–74)", "High (75+)", "Low (<60)"],
            values=[97.1, 1.88, 1.03],
            hole=0.52,
            marker=dict(
                colors=[INDIGO_MID, EMERALD, ROSE],
                line=dict(color="white", width=2.5)
            ),
            textinfo="label+percent",
            textfont=dict(size=11, family="Inter, sans-serif"),
            hovertemplate="%{label}<br>%{value}%<extra></extra>",
            pull=[0, 0.06, 0.06]
        ))
        fig_c.update_layout(
            height=280, margin=dict(l=10, r=10, t=10, b=10),
            paper_bgcolor=CHART_BG,
            font=dict(family="Inter, sans-serif", color=FONT_COLOR, size=11),
            showlegend=True,
            legend=dict(orientation="h", yanchor="bottom", y=-0.18,
                        xanchor="center", x=0.5, font_size=10)
        )
        st.plotly_chart(fig_c, use_container_width=True, config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)

    # ── Chart D: Average Score by Parental Involvement ────────────────────────
    with col_d:
        st.markdown('<div class="chart-card">'
                    '<p class="chart-card-title">Average Score by Parental Involvement</p>'
                    '<p class="chart-card-sub">How parental engagement correlates with exam outcomes</p>',
                    unsafe_allow_html=True)
        levels  = ["Low", "Medium", "High"]
        avg_scores = [66.4, 67.1, 68.1]
        colors = [ROSE, AMBER, EMERALD]
        fig_d = go.Figure()
        fig_d.add_trace(go.Bar(
            y=levels, x=avg_scores, orientation="h",
            marker=dict(color=colors, line=dict(width=0)),
            text=[f"{v}" for v in avg_scores],
            textposition="outside",
            textfont=dict(size=12, color=FONT_COLOR, family="Inter, sans-serif"),
            hovertemplate="%{y} involvement<br>Avg score: %{x}<extra></extra>",
            width=0.5
        ))
        fig_d.add_vline(x=67.2, line_dash="dash", line_color="#9ca3af",
                        line_width=1.4, annotation_text="Class mean",
                        annotation_position="top", annotation_font_size=10,
                        annotation_font_color="#9ca3af")
        fig_d.update_layout(
            height=280, margin=dict(l=10, r=80, t=20, b=10),
            paper_bgcolor=CHART_BG, plot_bgcolor=CHART_BG,
            font=dict(family="Inter, sans-serif", color=FONT_COLOR, size=11),
            xaxis=dict(title="Average Score", gridcolor=GRID_COLOR,
                       showgrid=True, zeroline=False, range=[64, 70],
                       title_font_size=11),
            yaxis=dict(gridcolor=GRID_COLOR, showgrid=False, zeroline=False,
                       tickfont=dict(size=12, color=FONT_COLOR)),
            showlegend=False
        )
        st.plotly_chart(fig_d, use_container_width=True, config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)


# ═════════════════════════════════════════════════════════════════════════════
# TAB 2: At-Risk Tracker
# ═════════════════════════════════════════════════════════════════════════════
with tab2:
    st.markdown('<div class="section-header">'
                '<p class="section-title">⚠️ At-Risk Student Tracker</p>'
                '<p class="section-subtitle">68 students flagged for low exam scores (&lt;60) or low attendance (&lt;70%). '
                'Use the filters below to drill into specific risk factors.</p>'
                '</div>', unsafe_allow_html=True)

    RISK_FACTORS = [
        "Low Attendance",
        "Low Study Hours",
        "Poor Sleep Quality",
        "High Absence Count",
        "No Tutoring Support",
        "Low Parental Involvement",
    ]

    rng2 = np.random.default_rng(99)
    n_at_risk = 68
    student_ids = [f"STU-{1000 + i:04d}" for i in range(n_at_risk)]
    attendance  = np.round(rng2.uniform(42, 72, n_at_risk), 1)
    exam_scores = np.round(rng2.uniform(28, 62, n_at_risk), 1)
    risk_levels = []
    for a, s in zip(attendance, exam_scores):
        if a < 60 and s < 50:
            risk_levels.append("High")
        elif a < 55 or s < 45:
            risk_levels.append("High")
        else:
            risk_levels.append("Medium")
    primary_factors = rng2.choice(RISK_FACTORS, n_at_risk)

    df_risk = pd.DataFrame({
        "Student ID": student_ids,
        "Attendance %": attendance,
        "Exam Score": exam_scores,
        "Risk Level": risk_levels,
        "Primary Risk Factor": primary_factors,
    })

    # ── Filters ───────────────────────────────────────────────────────────────
    fcol1, fcol2, fcol3 = st.columns([2, 2, 1], gap="medium")
    with fcol1:
        search_id = st.text_input(
            "🔍  Search by Student ID",
            placeholder="e.g. STU-1012",
            label_visibility="collapsed"
        )
    with fcol2:
        factor_options = ["All Risk Factors"] + RISK_FACTORS
        selected_factor = st.selectbox(
            "Filter by Risk Factor",
            options=factor_options,
            label_visibility="collapsed"
        )
    with fcol3:
        level_filter = st.selectbox(
            "Risk Level",
            options=["All", "High", "Medium"],
            label_visibility="collapsed"
        )

    # Apply filters
    df_filtered = df_risk.copy()
    if search_id.strip():
        df_filtered = df_filtered[
            df_filtered["Student ID"].str.contains(search_id.strip().upper(), na=False)
        ]
    if selected_factor != "All Risk Factors":
        df_filtered = df_filtered[df_filtered["Primary Risk Factor"] == selected_factor]
    if level_filter != "All":
        df_filtered = df_filtered[df_filtered["Risk Level"] == level_filter]

    # ── Summary chips ─────────────────────────────────────────────────────────
    n_high   = int((df_filtered["Risk Level"] == "High").sum())
    n_medium = int((df_filtered["Risk Level"] == "Medium").sum())
    n_shown  = len(df_filtered)
    st.markdown(f"""
    <div style="display:flex; gap:0.6rem; align-items:center; margin-bottom:0.85rem; flex-wrap:wrap;">
      <span style="font-size:0.82rem; color:#6b7280; font-weight:500;">
        Showing <strong style="color:#1e1b4b;">{n_shown}</strong> of 68 students
      </span>
      <span class="badge-risk badge-high">{n_high} High Risk</span>
      <span class="badge-risk badge-medium">{n_medium} Medium Risk</span>
    </div>
    """, unsafe_allow_html=True)

    # ── Styled table ──────────────────────────────────────────────────────────
    def style_risk_level(val):
        if val == "High":
            return "background-color:#fee2e2; color:#b91c1c; font-weight:700; border-radius:6px; padding:2px 8px;"
        return "background-color:#fef3c7; color:#92400e; font-weight:700; border-radius:6px; padding:2px 8px;"

    def style_score(val):
        if float(val) < 45:
            return "color:#b91c1c; font-weight:700;"
        return "color:#92400e; font-weight:600;"

    def style_attendance(val):
        if float(val) < 60:
            return "color:#b91c1c; font-weight:700;"
        return "color:#92400e; font-weight:600;"

    styled_df = (
        df_filtered.style
        .applymap(style_risk_level, subset=["Risk Level"])
        .applymap(style_score, subset=["Exam Score"])
        .applymap(style_attendance, subset=["Attendance %"])
        .format({"Attendance %": "{:.1f}%", "Exam Score": "{:.1f}"})
        .set_properties(**{
            "font-size": "0.83rem",
            "font-family": "Inter, sans-serif",
            "border-color": "#e5e7eb"
        })
        .set_table_styles([
            {"selector": "thead th", "props": [
                ("background-color", "#f8f7ff"),
                ("color", "#3730a3"),
                ("font-weight", "700"),
                ("font-size", "0.78rem"),
                ("text-transform", "uppercase"),
                ("letter-spacing", "0.04em"),
                ("padding", "0.65rem 0.9rem"),
                ("border-bottom", "2px solid #e5e7eb"),
            ]},
            {"selector": "tbody tr:hover td", "props": [
                ("background-color", "#f5f3ff !important"),
            ]},
            {"selector": "tbody td", "props": [
                ("padding", "0.55rem 0.9rem"),
                ("border-bottom", "1px solid #f3f4f6"),
            ]},
        ])
    )
    st.dataframe(
        df_filtered,
        use_container_width=True,
        height=420,
        hide_index=True,
        column_config={
            "Student ID":        st.column_config.TextColumn("Student ID", width=120),
            "Attendance %":      st.column_config.NumberColumn("Attendance %", format="%.1f%%", width=120),
            "Exam Score":        st.column_config.NumberColumn("Exam Score", format="%.1f", width=110),
            "Risk Level":        st.column_config.TextColumn("Risk Level", width=100),
            "Primary Risk Factor": st.column_config.TextColumn("Primary Risk Factor"),
        }
    )

    # ── Risk factor distribution mini chart ───────────────────────────────────
    st.markdown("<div style='height:1rem'></div>", unsafe_allow_html=True)
    factor_counts = df_filtered["Primary Risk Factor"].value_counts().reset_index()
    factor_counts.columns = ["Factor", "Count"]
    if len(factor_counts) > 0:
        fig_risk = go.Figure(go.Bar(
            x=factor_counts["Factor"],
            y=factor_counts["Count"],
            marker=dict(
                color=["#3730a3", "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"][:len(factor_counts)],
                line=dict(width=0)
            ),
            text=factor_counts["Count"],
            textposition="outside",
            hovertemplate="%{x}<br>%{y} students<extra></extra>"
        ))
        fig_risk.update_layout(
            title=dict(text="Risk Factor Distribution (filtered view)",
                       font=dict(size=13, color="#1e1b4b", family="Inter, sans-serif"),
                       x=0),
            height=220, margin=dict(l=10, r=10, t=35, b=10),
            paper_bgcolor="white", plot_bgcolor="white",
            font=dict(family="Inter, sans-serif", color="#374151", size=11),
            xaxis=dict(gridcolor="#f0f0f7", showgrid=False, zeroline=False,
                       tickangle=-20),
            yaxis=dict(gridcolor="#f0f0f7", showgrid=True, zeroline=False),
            showlegend=False
        )
        st.plotly_chart(fig_risk, use_container_width=True,
                        config={"displayModeBar": False})


# ═════════════════════════════════════════════════════════════════════════════
# TAB 3: Factor Comparisons
# ═════════════════════════════════════════════════════════════════════════════
with tab3:
    st.markdown('<div class="section-header">'
                '<p class="section-title">🔍 Factor Comparisons</p>'
                '<p class="section-subtitle">Compare how different student factors correlate with average exam scores.</p>'
                '</div>', unsafe_allow_html=True)

    FACTORS = {
        "Parental Involvement": {
            "labels": ["Low", "Medium", "High"],
            "values": [66.4, 67.1, 68.1],
            "colors": ["#ef4444", "#f59e0b", "#10b981"]
        },
        "Sleep Hours": {
            "labels": ["<6h", "6–7h", "7–8h", "8–9h", "9h+"],
            "values": [64.8, 66.5, 67.9, 67.4, 66.2],
            "colors": ["#ef4444", "#f59e0b", "#10b981", "#6366f1", "#3730a3"]
        },
        "Tutoring Sessions / Month": {
            "labels": ["0", "1–2", "3–4", "5+"],
            "values": [65.2, 66.9, 68.3, 69.7],
            "colors": ["#c7d2fe", "#818cf8", "#4f46e5", "#1e1b4b"]
        },
        "School Type": {
            "labels": ["Public", "Private"],
            "values": [66.9, 67.6],
            "colors": ["#6366f1", "#1e1b4b"]
        },
        "Extracurricular Activities": {
            "labels": ["None", "1 Activity", "2+ Activities"],
            "values": [66.8, 67.3, 67.7],
            "colors": ["#f59e0b", "#4f46e5", "#1e1b4b"]
        },
    }

    selected_factor_tab3 = st.selectbox(
        "Select factor to compare:",
        options=list(FACTORS.keys()),
        index=0
    )

    fdata = FACTORS[selected_factor_tab3]

    col_chart, col_info = st.columns([3, 1], gap="medium")

    with col_chart:
        st.markdown('<div class="chart-card">', unsafe_allow_html=True)
        fig_f = go.Figure(go.Bar(
            x=fdata["labels"],
            y=fdata["values"],
            marker=dict(color=fdata["colors"], line=dict(width=0)),
            text=[f"{v}" for v in fdata["values"]],
            textposition="outside",
            textfont=dict(size=13, family="Inter, sans-serif"),
            hovertemplate="%{x}<br>Avg Score: %{y}<extra></extra>",
            width=0.55
        ))
        fig_f.add_hline(y=67.2, line_dash="dash", line_color="#9ca3af",
                        line_width=1.5,
                        annotation_text="Class mean 67.2",
                        annotation_position="right",
                        annotation_font_size=10,
                        annotation_font_color="#9ca3af")
        fig_f.update_layout(
            height=320, margin=dict(l=10, r=20, t=20, b=10),
            paper_bgcolor="white", plot_bgcolor="white",
            font=dict(family="Inter, sans-serif", color="#374151", size=11),
            xaxis=dict(title=selected_factor_tab3, gridcolor="#f0f0f7",
                       showgrid=False, zeroline=False, title_font_size=12),
            yaxis=dict(title="Average Exam Score", gridcolor="#f0f0f7",
                       showgrid=True, zeroline=False,
                       range=[min(fdata["values"]) - 2, max(fdata["values"]) + 2],
                       title_font_size=12),
            showlegend=False
        )
        st.plotly_chart(fig_f, use_container_width=True,
                        config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)

    with col_info:
        vals = fdata["values"]
        spread = round(max(vals) - min(vals), 1)
        best_label = fdata["labels"][vals.index(max(vals))]
        worst_label = fdata["labels"][vals.index(min(vals))]
        st.markdown(f"""
        <div style="display:flex; flex-direction:column; gap:0.75rem; padding-top:0.25rem;">
          <div class="metric-card metric-green" style="min-width:unset;">
            <div class="metric-label">Best Group</div>
            <div class="metric-value" style="font-size:1.25rem;">{best_label}</div>
            <div class="metric-sub">Avg: {max(vals)}</div>
          </div>
          <div class="metric-card metric-red" style="min-width:unset;">
            <div class="metric-label">Lowest Group</div>
            <div class="metric-value" style="font-size:1.25rem;">{worst_label}</div>
            <div class="metric-sub">Avg: {min(vals)}</div>
          </div>
          <div class="metric-card metric-accent" style="min-width:unset;">
            <div class="metric-label">Score Spread</div>
            <div class="metric-value" style="font-size:1.25rem;">{spread}</div>
            <div class="metric-sub">Max − Min pts</div>
          </div>
        </div>
        """, unsafe_allow_html=True)
