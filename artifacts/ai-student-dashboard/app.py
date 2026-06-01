import streamlit as st
import plotly.graph_objects as go
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
    .block-container { padding: 0 2rem 2rem 2rem !important; max-width: 100% !important; }
    #MainMenu, footer, header { visibility: hidden; }

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
        width: 40px; height: 40px;
        background: rgba(255,255,255,0.15);
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.2rem;
        border: 1px solid rgba(255,255,255,0.25);
    }
    .app-header-title { color: white; font-size: 1.2rem; font-weight: 700; letter-spacing: -0.02em; }
    .app-header-subtitle { color: rgba(255,255,255,0.65); font-size: 0.78rem; margin-top: 1px; }
    .role-badge {
        background: rgba(255,255,255,0.15); color: white;
        padding: 0.35rem 0.9rem; border-radius: 50px;
        font-size: 0.8rem; font-weight: 600;
        border: 1px solid rgba(255,255,255,0.25);
    }

    .metrics-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .metric-card {
        flex: 1; min-width: 140px;
        background: white; border: 1.5px solid #e5e7eb;
        border-radius: 12px; padding: 1rem 1.2rem;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .metric-label { font-size: 0.72rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
    .metric-value { font-size: 1.6rem; font-weight: 800; color: #1e1b4b; margin: 0.15rem 0; line-height: 1; }
    .metric-sub { font-size: 0.73rem; color: #6b7280; }
    .metric-accent { border-left: 4px solid #3730a3; }
    .metric-green  { border-left: 4px solid #10b981; }
    .metric-amber  { border-left: 4px solid #f59e0b; }
    .metric-red    { border-left: 4px solid #ef4444; }
    .metric-purple { border-left: 4px solid #6366f1; }

    .section-title { font-size: 1.25rem; font-weight: 700; color: #1e1b4b; margin: 0; }
    .section-subtitle { color: #6b7280; font-size: 0.85rem; margin: 0.2rem 0 1.25rem 0; }

    .chart-card {
        background: white; border: 1.5px solid #e5e7eb;
        border-radius: 14px; padding: 1.2rem 1.4rem;
        box-shadow: 0 1px 6px rgba(0,0,0,0.06);
        margin-bottom: 1rem;
    }
    .chart-card-title { font-size: 0.9rem; font-weight: 700; color: #1e1b4b; margin: 0 0 0.2rem 0; }
    .chart-card-sub { font-size: 0.75rem; color: #9ca3af; margin: 0 0 0.6rem 0; }

    .badge-risk { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 50px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.02em; }
    .badge-high   { background: #fee2e2; color: #b91c1c; }
    .badge-medium { background: #fef3c7; color: #92400e; }

    .stTabs [data-baseweb="tab-list"] {
        gap: 0.25rem; background: #f1f0fa;
        border-radius: 12px; padding: 0.3rem; margin-bottom: 1.5rem;
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

    .filter-row { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
    .result-info { display: flex; gap: 0.6rem; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; }
</style>
""", unsafe_allow_html=True)

# ── Header ───────────────────────────────────────────────────────────────────
st.markdown("""
<div class="app-header">
  <div class="app-header-left">
    <div class="app-header-logo">🎓</div>
    <div>
      <div class="app-header-title">AI Student Performance Assistant</div>
      <div class="app-header-subtitle">Educational Analytics Platform &nbsp;·&nbsp; 6,607 Student Records</div>
    </div>
  </div>
  <div><span class="role-badge">👤 Teacher &amp; School Admin</span></div>
</div>
""", unsafe_allow_html=True)

# ── KPI row ───────────────────────────────────────────────────────────────────
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
  <div class="metric-card metric-purple">
    <div class="metric-label">Avg Attendance</div>
    <div class="metric-value">83.4%</div>
    <div class="metric-sub">School-wide</div>
  </div>
</div>
""", unsafe_allow_html=True)

# ── Seed data ─────────────────────────────────────────────────────────────────
rng = np.random.default_rng(42)
N = 6607
scores_med  = rng.uniform(60, 74, int(N * 0.971)).tolist()
scores_hi   = rng.uniform(75, 98, int(N * 0.0188)).tolist()
scores_lo   = rng.uniform(35, 59, int(N * 0.0103)).tolist()
all_scores  = np.array(scores_med + scores_hi + scores_lo)
rng.shuffle(all_scores)

study_hrs   = rng.uniform(1, 20, N)
score_study = np.clip(55 + study_hrs * 0.85 + rng.normal(0, 4, N), 30, 99)

INDIGO      = "#3730a3"
INDIGO_MID  = "#4f46e5"
AMBER       = "#f59e0b"
EMERALD     = "#10b981"
ROSE        = "#ef4444"
CHART_BG    = "white"
GRID        = "#f0f0f7"
FONT        = "#374151"

# ── Tabs ─────────────────────────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs([
    "📈  Charts & Distributions",
    "⚠️  At-Risk Tracker",
    "🔍  Factor Comparisons",
])

# ═══════════════════════════════════════════════════════════════════════════
# TAB 1 — Charts & Distributions
# ═══════════════════════════════════════════════════════════════════════════
with tab1:
    st.markdown('<p class="section-title">📈 Charts &amp; Distributions</p>'
                '<p class="section-subtitle">Score distributions, study hours correlation, and performance categories.</p>',
                unsafe_allow_html=True)

    col_a, col_b = st.columns(2, gap="medium")

    # ── A: Histogram ─────────────────────────────────────────────────────────
    with col_a:
        st.markdown('<div class="chart-card">'
                    '<p class="chart-card-title">Exam Score Distribution</p>'
                    '<p class="chart-card-sub">6,607 student exam scores · Mean: 67.2</p>',
                    unsafe_allow_html=True)
        fig_a = go.Figure(go.Histogram(
            x=all_scores, nbinsx=30,
            marker_color=INDIGO,
            marker_line_color="white", marker_line_width=0.6,
            opacity=0.88,
            hovertemplate="Score: %{x}<br>Count: %{y}<extra></extra>"
        ))
        fig_a.add_vline(x=67.2, line_dash="dash", line_color=ROSE, line_width=1.8,
                        annotation_text="Mean 67.2", annotation_position="top right",
                        annotation_font_color=ROSE, annotation_font_size=11)
        fig_a.update_layout(
            height=270, margin=dict(l=8, r=8, t=8, b=8),
            paper_bgcolor=CHART_BG, plot_bgcolor=CHART_BG,
            font=dict(family="sans-serif", color=FONT, size=11),
            xaxis=dict(title="Exam Score", gridcolor=GRID, showgrid=True, zeroline=False),
            yaxis=dict(title="Students", gridcolor=GRID, showgrid=True, zeroline=False),
            showlegend=False, bargap=0.04
        )
        st.plotly_chart(fig_a, use_container_width=True, config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)

    # ── B: Scatter ───────────────────────────────────────────────────────────
    with col_b:
        st.markdown('<div class="chart-card">'
                    '<p class="chart-card-title">Study Hours vs Exam Score</p>'
                    '<p class="chart-card-sub">Weekly study hours correlation · r = 0.74</p>',
                    unsafe_allow_html=True)
        idx = rng.choice(N, 500, replace=False)
        fig_b = go.Figure()
        fig_b.add_trace(go.Scatter(
            x=study_hrs[idx], y=score_study[idx], mode="markers",
            marker=dict(color=score_study[idx],
                        colorscale=[[0,"#c7d2fe"],[0.5,INDIGO_MID],[1,"#1e1b4b"]],
                        size=5, opacity=0.72, line=dict(width=0)),
            hovertemplate="Study hrs: %{x:.1f}<br>Score: %{y:.1f}<extra></extra>"
        ))
        tx = np.linspace(1, 20, 80)
        fig_b.add_trace(go.Scatter(x=tx, y=55+tx*0.85, mode="lines",
                                    line=dict(color=ROSE, width=2, dash="dot"),
                                    hoverinfo="skip"))
        fig_b.update_layout(
            height=270, margin=dict(l=8, r=8, t=8, b=8),
            paper_bgcolor=CHART_BG, plot_bgcolor=CHART_BG,
            font=dict(family="sans-serif", color=FONT, size=11),
            xaxis=dict(title="Weekly Study Hours", gridcolor=GRID, showgrid=True, zeroline=False),
            yaxis=dict(title="Exam Score", gridcolor=GRID, showgrid=True, zeroline=False),
            showlegend=False
        )
        st.plotly_chart(fig_b, use_container_width=True, config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)

    col_c, col_d = st.columns(2, gap="medium")

    # ── C: Pie ────────────────────────────────────────────────────────────────
    with col_c:
        st.markdown('<div class="chart-card">'
                    '<p class="chart-card-title">Performance Category Breakdown</p>'
                    '<p class="chart-card-sub">Low &lt;60 · Medium 60–74 · High 75+</p>',
                    unsafe_allow_html=True)
        fig_c = go.Figure(go.Pie(
            labels=["Medium (60–74)", "High (75+)", "Low (<60)"],
            values=[97.1, 1.88, 1.03], hole=0.52,
            marker=dict(colors=[INDIGO_MID, EMERALD, ROSE],
                        line=dict(color="white", width=2.5)),
            textinfo="label+percent",
            textfont=dict(size=11),
            hovertemplate="%{label}<br>%{value}%<extra></extra>",
            pull=[0, 0.06, 0.06]
        ))
        fig_c.update_layout(
            height=270, margin=dict(l=8, r=8, t=8, b=8),
            paper_bgcolor=CHART_BG,
            font=dict(family="sans-serif", color=FONT, size=11),
            showlegend=True,
            legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5, font_size=10)
        )
        st.plotly_chart(fig_c, use_container_width=True, config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)

    # ── D: Bar ────────────────────────────────────────────────────────────────
    with col_d:
        st.markdown('<div class="chart-card">'
                    '<p class="chart-card-title">Average Score by Parental Involvement</p>'
                    '<p class="chart-card-sub">How parental engagement correlates with exam outcomes</p>',
                    unsafe_allow_html=True)
        fig_d = go.Figure(go.Bar(
            y=["Low", "Medium", "High"], x=[66.4, 67.1, 68.1],
            orientation="h",
            marker=dict(color=[ROSE, AMBER, EMERALD], line=dict(width=0)),
            text=["66.4", "67.1", "68.1"], textposition="outside",
            textfont=dict(size=12, color=FONT),
            hovertemplate="%{y} involvement<br>Avg: %{x}<extra></extra>",
            width=0.5
        ))
        fig_d.add_vline(x=67.2, line_dash="dash", line_color="#9ca3af", line_width=1.4,
                        annotation_text="Class mean", annotation_position="top",
                        annotation_font_size=10, annotation_font_color="#9ca3af")
        fig_d.update_layout(
            height=270, margin=dict(l=8, r=70, t=20, b=8),
            paper_bgcolor=CHART_BG, plot_bgcolor=CHART_BG,
            font=dict(family="sans-serif", color=FONT, size=11),
            xaxis=dict(title="Average Score", gridcolor=GRID, showgrid=True, zeroline=False, range=[64, 70]),
            yaxis=dict(gridcolor=GRID, showgrid=False, zeroline=False),
            showlegend=False
        )
        st.plotly_chart(fig_d, use_container_width=True, config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════
# TAB 2 — At-Risk Tracker
# ═══════════════════════════════════════════════════════════════════════════
with tab2:
    st.markdown('<p class="section-title">⚠️ At-Risk Student Tracker</p>'
                '<p class="section-subtitle">68 students flagged for low exam scores (&lt;60) or low attendance (&lt;70%). '
                'Filter or search below.</p>',
                unsafe_allow_html=True)

    RISK_FACTORS = [
        "Low Attendance", "Low Study Hours", "Poor Sleep Quality",
        "High Absence Count", "No Tutoring Support", "Low Parental Involvement",
    ]
    rng2 = np.random.default_rng(99)
    n = 68
    attendance  = np.round(rng2.uniform(42, 72, n), 1)
    exam_scores = np.round(rng2.uniform(28, 62, n), 1)
    risk_levels = [
        "High" if (a < 60 and s < 50) or a < 55 or s < 45 else "Medium"
        for a, s in zip(attendance, exam_scores)
    ]
    df_risk = pd.DataFrame({
        "Student ID":          [f"STU-{1000+i:04d}" for i in range(n)],
        "Attendance %":        attendance,
        "Exam Score":          exam_scores,
        "Risk Level":          risk_levels,
        "Primary Risk Factor": rng2.choice(RISK_FACTORS, n),
    })

    # ── Filters ───────────────────────────────────────────────────────────────
    fc1, fc2, fc3 = st.columns([2.2, 2, 1], gap="medium")
    with fc1:
        search_id = st.text_input("Search Student ID", placeholder="e.g. STU-1012",
                                   label_visibility="collapsed")
    with fc2:
        factor_sel = st.selectbox("Risk Factor", ["All Risk Factors"] + RISK_FACTORS,
                                   label_visibility="collapsed")
    with fc3:
        level_sel = st.selectbox("Level", ["All", "High", "Medium"],
                                  label_visibility="collapsed")

    df_f = df_risk.copy()
    if search_id.strip():
        df_f = df_f[df_f["Student ID"].str.contains(search_id.strip().upper(), na=False)]
    if factor_sel != "All Risk Factors":
        df_f = df_f[df_f["Primary Risk Factor"] == factor_sel]
    if level_sel != "All":
        df_f = df_f[df_f["Risk Level"] == level_sel]

    n_high   = int((df_f["Risk Level"] == "High").sum())
    n_medium = int((df_f["Risk Level"] == "Medium").sum())
    st.markdown(f"""
    <div class="result-info">
      <span style="font-size:0.82rem;color:#6b7280;font-weight:500;">
        Showing <strong style="color:#1e1b4b;">{len(df_f)}</strong> of 68 students
      </span>
      <span class="badge-risk badge-high">{n_high} High</span>
      <span class="badge-risk badge-medium">{n_medium} Medium</span>
    </div>
    """, unsafe_allow_html=True)

    st.dataframe(
        df_f,
        use_container_width=True,
        height=400,
        hide_index=True,
        column_config={
            "Student ID":          st.column_config.TextColumn("Student ID", width=120),
            "Attendance %":        st.column_config.NumberColumn("Attendance %", format="%.1f%%", width=120),
            "Exam Score":          st.column_config.NumberColumn("Exam Score", format="%.1f", width=110),
            "Risk Level":          st.column_config.TextColumn("Risk Level", width=100),
            "Primary Risk Factor": st.column_config.TextColumn("Primary Risk Factor"),
        }
    )

    # ── Mini bar — risk factor distribution ──────────────────────────────────
    st.markdown("<div style='height:0.75rem'></div>", unsafe_allow_html=True)
    fcount = df_f["Primary Risk Factor"].value_counts().reset_index()
    fcount.columns = ["Factor", "Count"]
    if len(fcount):
        colors6 = ["#3730a3","#4f46e5","#6366f1","#818cf8","#a5b4fc","#c7d2fe"]
        fig_r = go.Figure(go.Bar(
            x=fcount["Factor"], y=fcount["Count"],
            marker=dict(color=colors6[:len(fcount)], line=dict(width=0)),
            text=fcount["Count"], textposition="outside",
            hovertemplate="%{x}<br>%{y} students<extra></extra>"
        ))
        fig_r.update_layout(
            title=dict(text="Risk Factor Distribution (filtered view)",
                       font=dict(size=13, color="#1e1b4b"), x=0),
            height=210, margin=dict(l=8, r=8, t=36, b=8),
            paper_bgcolor="white", plot_bgcolor="white",
            font=dict(family="sans-serif", color=FONT, size=11),
            xaxis=dict(showgrid=False, zeroline=False, tickangle=-15),
            yaxis=dict(gridcolor=GRID, showgrid=True, zeroline=False),
            showlegend=False
        )
        st.plotly_chart(fig_r, use_container_width=True, config={"displayModeBar": False})


# ═══════════════════════════════════════════════════════════════════════════
# TAB 3 — Factor Comparisons
# ═══════════════════════════════════════════════════════════════════════════
with tab3:
    st.markdown('<p class="section-title">🔍 Factor Comparisons</p>'
                '<p class="section-subtitle">Compare how different student factors correlate with average exam scores.</p>',
                unsafe_allow_html=True)

    FACTORS = {
        "Parental Involvement":         (["Low","Medium","High"],        [66.4,67.1,68.1],  [ROSE,AMBER,EMERALD]),
        "Sleep Hours":                  (["<6h","6–7h","7–8h","8–9h","9h+"], [64.8,66.5,67.9,67.4,66.2], [ROSE,AMBER,EMERALD,"#6366f1",INDIGO]),
        "Tutoring Sessions / Month":    (["0","1–2","3–4","5+"],         [65.2,66.9,68.3,69.7], ["#c7d2fe","#818cf8",INDIGO_MID,"#1e1b4b"]),
        "School Type":                  (["Public","Private"],           [66.9,67.6],        ["#6366f1","#1e1b4b"]),
        "Extracurricular Activities":   (["None","1 Activity","2+"],     [66.8,67.3,67.7],   [AMBER,INDIGO_MID,"#1e1b4b"]),
    }

    sel = st.selectbox("Select factor:", list(FACTORS.keys()), index=0)
    labels, vals, cols = FACTORS[sel]

    col_ch, col_kpi = st.columns([3, 1], gap="medium")
    with col_ch:
        st.markdown('<div class="chart-card">', unsafe_allow_html=True)
        fig_f = go.Figure(go.Bar(
            x=labels, y=vals,
            marker=dict(color=cols, line=dict(width=0)),
            text=[str(v) for v in vals], textposition="outside",
            textfont=dict(size=13, color=FONT),
            hovertemplate="%{x}<br>Avg: %{y}<extra></extra>",
            width=0.55
        ))
        fig_f.add_hline(y=67.2, line_dash="dash", line_color="#9ca3af", line_width=1.5,
                        annotation_text="Class mean 67.2",
                        annotation_position="right",
                        annotation_font_size=10, annotation_font_color="#9ca3af")
        fig_f.update_layout(
            height=310, margin=dict(l=8, r=20, t=16, b=8),
            paper_bgcolor="white", plot_bgcolor="white",
            font=dict(family="sans-serif", color=FONT, size=11),
            xaxis=dict(title=sel, showgrid=False, zeroline=False),
            yaxis=dict(title="Average Exam Score", gridcolor=GRID,
                       showgrid=True, zeroline=False,
                       range=[min(vals)-2, max(vals)+2]),
            showlegend=False
        )
        st.plotly_chart(fig_f, use_container_width=True, config={"displayModeBar": False})
        st.markdown('</div>', unsafe_allow_html=True)

    with col_kpi:
        best  = labels[vals.index(max(vals))]
        worst = labels[vals.index(min(vals))]
        spread = round(max(vals) - min(vals), 1)
        st.markdown(f"""
        <div style="display:flex;flex-direction:column;gap:0.75rem;padding-top:0.25rem;">
          <div class="metric-card metric-green" style="min-width:unset;">
            <div class="metric-label">Best Group</div>
            <div class="metric-value" style="font-size:1.25rem;">{best}</div>
            <div class="metric-sub">Avg: {max(vals)}</div>
          </div>
          <div class="metric-card metric-red" style="min-width:unset;">
            <div class="metric-label">Lowest Group</div>
            <div class="metric-value" style="font-size:1.25rem;">{worst}</div>
            <div class="metric-sub">Avg: {min(vals)}</div>
          </div>
          <div class="metric-card metric-accent" style="min-width:unset;">
            <div class="metric-label">Score Spread</div>
            <div class="metric-value" style="font-size:1.25rem;">{spread}</div>
            <div class="metric-sub">Max − Min pts</div>
          </div>
        </div>
        """, unsafe_allow_html=True)
