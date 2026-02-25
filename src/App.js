/* eslint-disable */
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { background: #f5f0e8; font-size: 16px; }
  input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  input[type=number] { -moz-appearance: textfield; }
  :root {
    --parchment: #f5f0e8; --parchment-dark: #ece6d8; --parchment-deep: #e0d8c8;
    --espresso: #1e1208; --espresso-mid: #3a2a1c; --espresso-light: #6a5248;
    --copper: #b5762a; --copper-light: #d4944a; --copper-pale: #f0e0c0;
    --text-muted: #7a6a5a; --border: #c8b898; --border-light: #ddd0b8;
    --success: #4a6a2a; --danger: #7a2818;
    --ff-display: 'Playfair Display', Georgia, serif;
    --ff-body: 'Lora', Georgia, serif;
  }
  .im-app { background: var(--parchment); min-height: 100vh; color: var(--espresso); font-family: var(--ff-body); max-width: 480px; margin: 0 auto; padding-bottom: 90px; }
  .im-app * { font-family: var(--ff-body); }
  .im-header { padding: 26px 22px 20px; border-bottom: 1px solid var(--border); background: var(--parchment); position: sticky; top: 0; z-index: 50; }
  .im-header-row { display: flex; justify-content: space-between; align-items: flex-start; }
  .im-logo { font-family: var(--ff-display); font-size: 30px; font-weight: 900; color: var(--espresso); letter-spacing: -0.5px; line-height: 1; }
  .im-logo-accent { color: var(--copper); font-style: italic; }
  .im-tagline { font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text-muted); margin-top: 5px; font-weight: 600; }
  .im-streak { text-align: right; }
  .im-streak-num { font-family: var(--ff-display); font-size: 34px; font-weight: 900; color: var(--copper); line-height: 1; }
  .im-streak-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-top: 2px; font-weight: 600; }
  .im-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: var(--parchment); border-top: 1px solid var(--border); display: flex; z-index: 100; }
  .im-nav-btn { flex: 1; padding: 10px 0 16px; background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; border-top: 2px solid transparent; transition: all 0.15s; }
  .im-nav-btn.active { border-top: 2px solid var(--copper); }
  .im-nav-icon { font-size: 20px; line-height: 1; }
  .im-nav-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
  .im-nav-btn.active .im-nav-label { color: var(--copper); }
  .im-body { padding: 22px 22px 0; }
  .im-section { margin-bottom: 26px; }
  .im-section-title { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 14px; padding-bottom: 7px; border-bottom: 1px solid var(--border-light); font-weight: 600; }
  .im-divider { height: 1px; background: var(--border-light); margin: 14px 0; }
  .im-card { background: var(--parchment-dark); border: 1px solid var(--border); border-radius: 3px; padding: 18px; margin-bottom: 12px; }
  .im-card-accent { background: var(--parchment-dark); border: 1px solid var(--copper); border-radius: 3px; padding: 18px; margin-bottom: 12px; }
  .im-card-title { font-family: var(--ff-display); font-size: 19px; font-weight: 700; color: var(--espresso); margin-bottom: 4px; }
  .im-card-sub { font-size: 12px; color: var(--text-muted); letter-spacing: 0.5px; font-weight: 500; }
  .im-stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 16px; }
  .im-stat { background: var(--parchment-dark); border: 1px solid var(--border); border-radius: 3px; padding: 16px 10px; text-align: center; }
  .im-stat-val { font-family: var(--ff-display); font-size: 28px; font-weight: 700; color: var(--copper); line-height: 1; }
  .im-stat-val-sm { font-family: var(--ff-display); font-size: 20px; font-weight: 700; color: var(--copper); line-height: 1; }
  .im-stat-unit { font-size: 13px; color: var(--text-muted); }
  .im-stat-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-top: 5px; font-weight: 600; }
  .im-stat-delta { font-size: 11px; margin-top: 4px; font-weight: 600; }
  .im-delta-pos { color: var(--success); }
  .im-delta-neg { color: var(--danger); }
  .im-week { display: flex; gap: 5px; margin-bottom: 16px; }
  .im-day { flex: 1; border-radius: 3px; padding: 11px 4px; text-align: center; border: 1px solid var(--border); background: var(--parchment-dark); cursor: pointer; transition: all 0.15s; }
  .im-day.done { background: var(--espresso); border-color: var(--espresso); }
  .im-day.today { background: var(--copper); border-color: var(--copper); }
  .im-day-name { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
  .im-day.done .im-day-name, .im-day.today .im-day-name { color: rgba(245,240,232,0.85); }
  .im-day-muscle { font-size: 8px; color: var(--espresso-light); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.3px; font-weight: 500; }
  .im-day.done .im-day-muscle, .im-day.today .im-day-muscle { color: rgba(245,240,232,0.85); }
  .im-day-check { font-size: 11px; margin-top: 3px; color: var(--copper-light); font-weight: 700; }
  .im-day.done .im-day-check { color: rgba(245,240,232,0.7); }
  .im-btn-primary { background: var(--espresso); color: var(--parchment); border: none; border-radius: 2px; padding: 14px 20px; font-family: var(--ff-body); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; width: 100%; transition: background 0.15s; font-weight: 600; }
  .im-btn-copper { background: var(--copper); color: var(--parchment); border: none; border-radius: 2px; padding: 11px 20px; font-family: var(--ff-body); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; font-weight: 600; }
  .im-btn-ghost { background: transparent; border: 1px solid var(--border); border-radius: 2px; padding: 11px 16px; font-family: var(--ff-body); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); cursor: pointer; font-weight: 500; }
  .im-btn-add { background: transparent; border: 1px dashed var(--border); border-radius: 2px; padding: 12px 14px; font-family: var(--ff-body); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); cursor: pointer; width: 100%; text-align: left; font-weight: 500; }
  .im-btn-sm { background: var(--copper); color: var(--parchment); border: none; border-radius: 2px; padding: 8px 14px; font-family: var(--ff-body); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; font-weight: 600; }
  .im-input { background: var(--parchment); border: 1px solid var(--border); border-radius: 2px; color: var(--espresso); padding: 10px 12px; font-size: 16px; font-family: var(--ff-body); width: 100%; font-weight: 500; }
  .im-input:focus { outline: none; border-color: var(--copper); }
  .im-input-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; display: block; font-weight: 600; }
  .im-textarea { background: var(--parchment); border: 1px solid var(--border); border-radius: 2px; color: var(--espresso); padding: 10px 12px; font-size: 14px; font-family: var(--ff-body); width: 100%; resize: vertical; min-height: 70px; line-height: 1.6; font-weight: 500; }
  .im-textarea:focus { outline: none; border-color: var(--copper); }
  .im-set-header { display: grid; grid-template-columns: 32px 1fr 1fr 32px; gap: 6px; margin-bottom: 6px; }
  .im-set-col-label { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); text-align: center; font-weight: 600; }
  .im-set-row { display: grid; grid-template-columns: 32px 1fr 1fr 32px; gap: 6px; align-items: center; margin-bottom: 8px; }
  .im-set-num { font-size: 13px; color: var(--text-muted); text-align: center; font-weight: 600; }
  .im-fail-btn { width: 32px; height: 40px; border-radius: 2px; border: 1.5px solid var(--border); background: transparent; color: var(--text-muted); font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: var(--ff-body); }
  .im-fail-btn.active { border-color: var(--danger); background: rgba(122,40,24,0.12); color: var(--danger); }
  .im-set-badge { display: inline-block; font-size: 11px; background: var(--parchment); border: 1px solid var(--border); border-radius: 2px; padding: 4px 9px; margin: 2px 2px 2px 0; color: var(--espresso-mid); font-weight: 500; }
  .im-set-badge.fail { border-color: var(--danger); color: var(--danger); background: rgba(122,40,24,0.08); }
  .im-chip { display: inline-block; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; border: 1px solid var(--border); border-radius: 2px; padding: 4px 10px; color: var(--text-muted); margin: 2px; cursor: pointer; background: transparent; font-family: var(--ff-body); font-weight: 500; }
  .im-chip.active { border-color: var(--copper); color: var(--copper); background: var(--copper-pale); font-weight: 600; }
  .im-chart-card { background: var(--parchment-dark); border: 1px solid var(--border); border-radius: 3px; padding: 18px 14px 10px; margin-bottom: 14px; }
  .im-chart-title { font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; font-weight: 600; }
  .im-chart-hero { font-family: var(--ff-display); font-size: 48px; font-weight: 900; color: var(--espresso); line-height: 1; }
  .im-chart-hero span { font-size: 20px; color: var(--text-muted); margin-left: 3px; }
  .im-chart-delta { font-size: 14px; margin-left: 10px; font-family: var(--ff-display); font-style: italic; font-weight: 600; }
  .im-strength-badge { display: inline-block; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 2px; padding: 4px 10px; font-weight: 700; }
  .im-strength-novice { background: rgba(74,106,42,0.15); color: #4a6a2a; border: 1px solid rgba(74,106,42,0.4); }
  .im-strength-intermediate { background: rgba(181,118,42,0.15); color: var(--copper); border: 1px solid rgba(181,118,42,0.4); }
  .im-strength-advanced { background: rgba(30,18,8,0.12); color: var(--espresso); border: 1px solid rgba(30,18,8,0.35); }
  .im-strength-elite { background: rgba(181,118,42,0.25); color: #6a3a08; border: 1px solid var(--copper); }
  .im-timer { position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: var(--espresso); color: var(--parchment); z-index: 200; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--copper); }
  .im-timer-time { font-family: var(--ff-display); font-size: 30px; font-weight: 900; color: var(--copper); }
  .im-timer-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(245,240,232,0.7); font-weight: 600; }
  .im-timer-btn { background: var(--copper); color: var(--espresso); border: none; border-radius: 2px; padding: 7px 14px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; font-family: var(--ff-body); font-weight: 700; }
  .im-picker { background: var(--parchment-dark); border: 1px solid var(--copper); border-radius: 3px; padding: 16px; margin-bottom: 12px; }
  .im-picker-item { padding: 13px 4px; border-bottom: 1px solid var(--border-light); cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 15px; color: var(--espresso-mid); font-weight: 500; }
  .im-picker-item:last-child { border-bottom: none; }
  .im-vol-bar { height: 7px; background: var(--border); border-radius: 3px; overflow: hidden; margin-top: 6px; }
  .im-vol-fill { height: 100%; border-radius: 3px; }
  .im-1rm { background: var(--parchment-deep); border: 1px solid var(--border); border-radius: 3px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
  .im-1rm-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
  .im-1rm-val { font-family: var(--ff-display); font-size: 22px; font-weight: 700; color: var(--copper); }
  .im-progress-rec { background: rgba(74,106,42,0.1); border: 1px solid rgba(74,106,42,0.3); border-radius: 3px; padding: 11px 14px; margin-bottom: 10px; font-size: 12px; color: #3a5a1a; line-height: 1.6; font-weight: 500; }
  .im-warmup-hint { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; font-style: italic; font-weight: 500; }
  .im-loading { display: flex; justify-content: center; align-items: center; height: 200px; font-size: 14px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; font-weight: 600; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--parchment); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const USER = { weight: 205 };

const EXERCISE_LIBRARY = {
  Chest: [
    { name: "Barbell Bench Press", primary: true }, { name: "Incline Barbell Press", primary: true },
    { name: "Decline Barbell Press" }, { name: "Dumbbell Bench Press" }, { name: "Incline Dumbbell Press" },
    { name: "Cable Chest Fly" }, { name: "Pec Deck Machine" }, { name: "Dips (Chest)" }, { name: "Push-Up (Weighted)" },
  ],
  Back: [
    { name: "Barbell Deadlift", primary: true }, { name: "Barbell Row", primary: true },
    { name: "Pull-Up / Chin-Up", primary: true }, { name: "Lat Pulldown" }, { name: "Seated Cable Row" },
    { name: "T-Bar Row" }, { name: "Single-Arm DB Row" }, { name: "Face Pull" }, { name: "Rack Pull" },
    { name: "Straight-Arm Pulldown" }, { name: "Shrug" },
  ],
  Legs: [
    { name: "Barbell Back Squat", primary: true }, { name: "Romanian Deadlift", primary: true },
    { name: "Leg Press" }, { name: "Hack Squat" }, { name: "Bulgarian Split Squat" },
    { name: "Lunges (Barbell)" }, { name: "Leg Curl" }, { name: "Leg Extension" },
    { name: "Standing Calf Raise" }, { name: "Seated Calf Raise" }, { name: "Hip Thrust" },
  ],
  Shoulders: [
    { name: "Barbell Overhead Press", primary: true }, { name: "Arnold Press" },
    { name: "Dumbbell Lateral Raise" }, { name: "Cable Lateral Raise" }, { name: "Rear Delt Fly" },
    { name: "Machine Shoulder Press" }, { name: "Front Raise" }, { name: "Face Pull" },
  ],
  Biceps: [
    { name: "Barbell Curl", primary: true }, { name: "Dumbbell Curl" }, { name: "Hammer Curl" },
    { name: "Incline Dumbbell Curl" }, { name: "Preacher Curl" }, { name: "Cable Curl" },
    { name: "Spider Curl" }, { name: "Concentration Curl" },
  ],
  Triceps: [
    { name: "Skull Crushers", primary: true }, { name: "Close-Grip Bench Press", primary: true },
    { name: "Tricep Pushdown (Bar)" }, { name: "Tricep Pushdown (Rope)" },
    { name: "Overhead Tricep Extension" }, { name: "Dips (Tricep)" },
  ],
  Core: [
    { name: "Cable Crunch" }, { name: "Hanging Leg Raise" }, { name: "Ab Wheel" },
    { name: "Plank (Weighted)" }, { name: "Russian Twist" }, { name: "Pallof Press" },
  ],
  Cardio: [
    { name: "Treadmill" }, { name: "Assault Bike" }, { name: "Rowing Machine" },
    { name: "Stairmaster" }, { name: "Jump Rope" },
  ],
};

const WEEKLY_PLAN = {
  Monday:    { muscle: "Chest",     focus: "Horizontal Push", exercises: ["Barbell Bench Press", "Incline Barbell Press", "Cable Chest Fly", "Dips (Chest)"], note: "Push intensity on top sets." },
  Tuesday:   { muscle: "Back",      focus: "Pull", exercises: ["Barbell Deadlift", "Barbell Row", "Pull-Up / Chin-Up", "Face Pull"], note: "Deadlift first, fresh." },
  Wednesday: { muscle: "Legs",      focus: "Quad & Posterior Chain", exercises: ["Barbell Back Squat", "Romanian Deadlift", "Leg Press", "Leg Curl", "Standing Calf Raise"], note: "Highest volume day." },
  Thursday:  { muscle: "Shoulders", focus: "Overhead & Isolation", exercises: ["Barbell Overhead Press", "Dumbbell Lateral Raise", "Rear Delt Fly", "Arnold Press"], note: "Higher reps on isolation." },
  Friday:    { muscle: "Arms",      focus: "Biceps & Triceps", exercises: ["Barbell Curl", "Skull Crushers", "Hammer Curl", "Tricep Pushdown (Bar)", "Incline Dumbbell Curl"], note: "Superset bi/tri to save time." },
  Saturday:  { muscle: "Core",      focus: "Core & Conditioning", exercises: ["Cable Crunch", "Hanging Leg Raise", "Ab Wheel", "Pallof Press"], note: "Add 20 min cardio post-session." },
};

const BASE_WEIGHTS = {
  "Barbell Bench Press": 275, "Incline Barbell Press": 225, "Decline Barbell Press": 245,
  "Barbell Deadlift": 335, "Barbell Row": 205, "Pull-Up / Chin-Up": 0,
  "Barbell Back Squat": 335, "Romanian Deadlift": 255, "Leg Press": 405,
  "Barbell Overhead Press": 155, "Dumbbell Curl": 45, "Barbell Curl": 95,
  "Skull Crushers": 115, "Close-Grip Bench Press": 205, "Hammer Curl": 50,
  "Bulgarian Split Squat": 135, "Hip Thrust": 225, "Hack Squat": 225,
};

const DEFAULT_MEASUREMENT_FIELDS = ["weight", "bodyFat", "chest", "waist", "arms", "legs", "calves", "neck"];
const MEASUREMENT_UNITS = { weight: "lb", bodyFat: "%", chest: '"', waist: '"', arms: '"', legs: '"', calves: '"', neck: '"', shoulders: '"', hips: '"', forearms: '"' };
const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ─── UTILS ────────────────────────────────────────────────────────────────────
function getBaseWeight(name) { return BASE_WEIGHTS[name] || 95; }
function calc1RM(weight, reps) { if (reps <= 1) return weight; return Math.round(weight * (1 + reps / 30)); }
// Absolute lb standards for ~200lb male (from Symmetric Strength / ExRx)
const STRENGTH_STANDARDS = {
  "Barbell Back Squat":       { novice: 175, intermediate: 255, advanced: 340, elite: 425 },
  "Romanian Deadlift":        { novice: 155, intermediate: 225, advanced: 300, elite: 375 },
  "Barbell Deadlift":         { novice: 205, intermediate: 300, advanced: 395, elite: 490 },
  "Rack Pull":                { novice: 225, intermediate: 325, advanced: 425, elite: 525 },
  "Barbell Bench Press":      { novice: 135, intermediate: 200, advanced: 270, elite: 340 },
  "Incline Barbell Press":    { novice: 115, intermediate: 175, advanced: 235, elite: 300 },
  "Decline Barbell Press":    { novice: 145, intermediate: 215, advanced: 285, elite: 360 },
  "Close-Grip Bench Press":   { novice: 120, intermediate: 185, advanced: 250, elite: 315 },
  "Barbell Overhead Press":   { novice: 85,  intermediate: 130, advanced: 175, elite: 220 },
  "Barbell Row":              { novice: 115, intermediate: 175, advanced: 235, elite: 295 },
  "Barbell Curl":             { novice: 65,  intermediate: 100, advanced: 135, elite: 170 },
  "Skull Crushers":           { novice: 75,  intermediate: 115, advanced: 155, elite: 195 },
  "Leg Press":                { novice: 215, intermediate: 330, advanced: 450, elite: 565 },
  "Hack Squat":               { novice: 175, intermediate: 270, advanced: 365, elite: 455 },
  "Hip Thrust":               { novice: 175, intermediate: 265, advanced: 360, elite: 450 },
};
function getStrengthLevel(exercise, weight) {
  const s = STRENGTH_STANDARDS[exercise];
  if (!s) {
    // Generic fallback for unlisted exercises
    if (weight >= 225) return "Advanced";
    if (weight >= 135) return "Intermediate";
    return "Novice";
  }
  if (weight >= s.elite) return "Elite";
  if (weight >= s.advanced) return "Advanced";
  if (weight >= s.intermediate) return "Intermediate";
  return "Novice";
}
function strengthBadgeClass(level) {
  return { Novice: "im-strength-novice", Intermediate: "im-strength-intermediate", Advanced: "im-strength-advanced", Elite: "im-strength-elite" }[level] || "im-strength-intermediate";
}
function getWarmupHint(topWeight) {
  if (!topWeight || topWeight <= 45) return null;
  const w = Math.max(Math.round((topWeight * 0.5) / 5) * 5, 45);
  return `Warm-up: ~${w}lb × 8–10 reps`;
}
function getProgressionRec(lastSets) {
  if (!lastSets || lastSets.length === 0) return null;
  const allClean = lastSets.every(s => !s.toFailure && parseInt(s.reps) >= 8);
  const topSet = lastSets[lastSets.length - 1];
  const topWeight = parseFloat(topSet.weight) || 0;
  if (allClean) return `All sets clean last session → try +5lb (${topWeight + 5}lb)`;
  if (topSet.toFailure && parseInt(topSet.reps) >= 6) return `Good effort last time. Hold weight, aim for +1 rep.`;
  return `Focus on quality reps before adding load.`;
}
function weeklyVolume(workouts, muscle) {
  const d = new Date(); d.setDate(d.getDate() - d.getDay());
  const weekStr = d.toISOString().split("T")[0];
  let sets = 0;
  workouts.filter(w => w.date >= weekStr && w.muscle_group === muscle)
    .forEach(w => w.exercises.forEach(e => { sets += e.sets.length; }));
  return sets;
}
function todayStr() { return new Date().toISOString().split("T")[0]; }
function fmtDate(d) { const parts = d.split("-"); return `${parts[1]}/${parts[2]}`; }
function fmtDateFull(d) { return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
function todayDay() { return new Date().toLocaleDateString("en-US", { weekday: "long" }); }

// ─── TIMER HOOK ───────────────────────────────────────────────────────────────
function useRestTimer() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(120);
  const intervalRef = useRef(null);
  const totalRef = useRef(120);

  const start = useCallback((duration = 120) => {
    clearInterval(intervalRef.current);
    totalRef.current = duration;
    setSeconds(duration);
    setActive(true);
  }, []);

  const dismiss = useCallback(() => {
    setActive(false);
    clearInterval(intervalRef.current);
  }, []);

  const adjust = useCallback((delta) => {
    setSeconds(s => Math.max(10, s + delta));
  }, []);

  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { clearInterval(intervalRef.current); setActive(false); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const display = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  return { active, display, start, dismiss, adjust };
}

// ─── EXERCISE PICKER COMPONENT ────────────────────────────────────────────────
function ExercisePicker({ group, onSelect, onCancel, swapping }) {
  const [activeGroup, setActiveGroup] = useState(group);
  return (
    <div className="im-picker">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {Object.keys(EXERCISE_LIBRARY).map(g => (
          <button key={g} className={`im-chip${g === activeGroup ? " active" : ""}`} onClick={() => setActiveGroup(g)}>{g}</button>
        ))}
      </div>
      <div className="im-section-title" style={{ marginBottom: 8 }}>
        {swapping ? "Select replacement" : "Add exercise"} — {activeGroup}
      </div>
      {EXERCISE_LIBRARY[activeGroup].map((ex, i) => (
        <div key={i} className="im-picker-item" onClick={() => onSelect(ex, activeGroup)}>
          <span>{ex.name}{ex.primary ? " ★" : ""}</span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{getBaseWeight(ex.name) > 0 ? `~${getBaseWeight(ex.name)}lb` : "BW"} ›</span>
        </div>
      ))}
      <button className="im-btn-ghost" style={{ width: "100%", marginTop: 8 }} onClick={onCancel}>Cancel</button>
    </div>
  );
}

// ─── LOG VIEW (top-level component — critical for stable renders) ──────────────
function LogView({ activeWorkout, workouts, onSave, onDiscard, timer }) {
  const [wkt, setWkt] = useState(() => activeWorkout || {
    id: `w${Date.now()}`, date: todayStr(), day: todayDay(), muscleGroup: "Chest", notes: "", exercises: []
  });
  const [showPicker, setShowPicker] = useState(false);
  const [swapIndex, setSwapIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 60000)), 15000);
    return () => clearInterval(iv);
  }, []);

  function handleSelectExercise(ex, group) {
    const lastSimilar = workouts.filter(w => w.day === wkt.day)[0];
    const lastEx = lastSimilar?.exercises.find(e => e.name === ex.name);
    const recWeight = lastEx
      ? Math.max(...lastEx.sets.map(s => parseFloat(s.weight) || 0))
      : getBaseWeight(ex.name);

    if (swapIndex !== null) {
      setWkt(prev => {
        const exs = prev.exercises.map((e, i) =>
          i === swapIndex ? { name: ex.name, recWeight, sets: [] } : e
        );
        return { ...prev, exercises: exs, muscleGroup: group };
      });
      setSwapIndex(null);
    } else {
      setWkt(prev => ({
        ...prev,
        exercises: [...prev.exercises, { name: ex.name, recWeight, sets: [] }],
        muscleGroup: group,
      }));
    }
    setShowPicker(false);
  }

  function addSet(ei) {
    setWkt(prev => {
      const exs = prev.exercises.map((ex, i) => {
        if (i !== ei) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, {
            reps: lastSet?.reps || "",
            weight: lastSet?.weight || ex.recWeight || "",
            toFailure: false
          }]
        };
      });
      return { ...prev, exercises: exs };
    });
  }

  function updateSet(ei, si, field, val) {
    setWkt(prev => {
      const exs = prev.exercises.map((ex, i) => {
        if (i !== ei) return ex;
        const sets = ex.sets.map((s, j) => j === si ? { ...s, [field]: val } : s);
        return { ...ex, sets };
      });
      return { ...prev, exercises: exs };
    });
  }

  function removeExercise(ei) {
    setWkt(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== ei)
    }));
  }

  async function handleSave() {
    if (wkt.exercises.length === 0) return;
    setSaving(true);
    await onSave(wkt);
    setSaving(false);
  }

  const totalSets = wkt.exercises.reduce((a, e) => a + e.sets.length, 0);

  return (
    <div>
      {timer.active && (
        <div className="im-timer">
          <div>
            <div className="im-timer-label">Rest Timer</div>
            <div className="im-timer-time">{timer.display}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="im-timer-btn" onClick={() => timer.adjust(-15)}>−15s</button>
            <button className="im-timer-btn" onClick={() => timer.adjust(15)}>+15s</button>
            <button className="im-timer-btn" style={{ background: "rgba(245,240,232,0.2)", color: "var(--parchment)" }} onClick={timer.dismiss}>✕</button>
          </div>
        </div>
      )}
      <div className="im-header" style={{ paddingTop: timer.active ? 72 : 24 }}>
        <div className="im-header-row">
          <div>
            <div className="im-logo" style={{ fontSize: 22 }}>Log <span className="im-logo-accent">Session</span></div>
            <div className="im-tagline">{wkt.day} · {wkt.muscleGroup}</div>
          </div>
          <div className="im-streak">
            <div className="im-streak-num">{elapsed}m</div>
            <div className="im-streak-label">Active</div>
          </div>
        </div>
      </div>

      <div className="im-body">
        {wkt.exercises.map((ex, ei) => {
          const lastSimilar = workouts.filter(w => w.day === wkt.day)[0];
          const lastEx = lastSimilar?.exercises.find(e => e.name === ex.name);
          const topSet = ex.sets.length > 0 ? [...ex.sets].sort((a, b) => (b.weight || 0) - (a.weight || 0))[0] : null;
          const est1RM = topSet?.reps && topSet?.weight ? calc1RM(parseFloat(topSet.weight), parseInt(topSet.reps)) : null;
          const strengthLevel = topSet?.weight ? getStrengthLevel(ex.name, parseFloat(topSet.weight)) : null;
          const rec = getProgressionRec(lastEx?.sets);
          const warmupHint = ex.sets.length === 0 ? getWarmupHint(ex.recWeight) : null;

          return (
            <div key={ei} style={{ background: "var(--parchment-dark)", border: "1px solid var(--border)", borderRadius: 3, padding: 16, marginBottom: 14 }}>
              {/* Exercise header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <div style={{ fontFamily: "var(--ff-display)", fontSize: 17, fontWeight: 700, color: "var(--copper)", marginBottom: 2 }}>{ex.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Rec. start: {ex.recWeight}lb{strengthLevel ? "" : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  {strengthLevel && (
                    <span className={`im-strength-badge ${strengthBadgeClass(strengthLevel)}`}>{strengthLevel}</span>
                  )}
                  <button
                    onClick={() => { setSwapIndex(ei); setShowPicker(true); }}
                    style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 2, padding: "4px 10px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--ff-body)" }}>
                    Swap
                  </button>
                  <button
                    onClick={() => removeExercise(ei)}
                    style={{ background: "transparent", border: "1px solid var(--danger)", borderRadius: 2, padding: "4px 8px", fontSize: 11, color: "var(--danger)", cursor: "pointer" }}>
                    ✕
                  </button>
                </div>
              </div>

              {/* Warm-up hint */}
              {warmupHint && <div className="im-warmup-hint">{warmupHint}</div>}

              {/* Progression rec */}
              {rec && ex.sets.length === 0 && <div className="im-progress-rec">📈 {rec}</div>}

              {/* Sets */}
              {ex.sets.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div className="im-set-header">
                    <div className="im-set-col-label">Set</div>
                    <div className="im-set-col-label">Reps</div>
                    <div className="im-set-col-label">Weight (lb)</div>
                    <div className="im-set-col-label">Fail</div>
                  </div>
                  {ex.sets.map((s, si) => (
                    <div key={si}>
                      <div className="im-set-row">
                        <div className="im-set-num">{si + 1}</div>
                        <input
                          type="number"
                          className="im-input"
                          style={{ textAlign: "center", padding: "8px 4px" }}
                          value={s.reps}
                          onChange={e => updateSet(ei, si, "reps", e.target.value)}
                          placeholder="0"
                        />
                        <input
                          type="number"
                          className="im-input"
                          style={{ textAlign: "center", padding: "8px 4px" }}
                          value={s.weight}
                          onChange={e => updateSet(ei, si, "weight", e.target.value)}
                          placeholder="0"
                        />
                        <button
                          className={`im-fail-btn${s.toFailure ? " active" : ""}`}
                          onClick={() => updateSet(ei, si, "toFailure", !s.toFailure)}>
                          F
                        </button>
                      </div>
                      {si === ex.sets.length - 1 && (
                        <button
                          onClick={() => timer.start(120)}
                          style={{ width: "100%", background: "var(--espresso)", color: "var(--copper)", border: "none", borderRadius: 2, padding: "7px 10px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--ff-body)", marginBottom: 8 }}>
                          ⏱ Start Rest Timer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button className="im-btn-add" onClick={() => addSet(ei)}>+ Add Set</button>

              {est1RM && (
                <div className="im-1rm">
                  <div>
                    <div className="im-1rm-label">Estimated 1RM</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Epley Formula</div>
                  </div>
                  <div className="im-1rm-val">{est1RM}<span style={{ fontSize: 13, color: "var(--text-muted)" }}>lb</span></div>
                </div>
              )}
            </div>
          );
        })}

        {showPicker
          ? <ExercisePicker
              group={wkt.muscleGroup}
              swapping={swapIndex !== null}
              onSelect={handleSelectExercise}
              onCancel={() => { setShowPicker(false); setSwapIndex(null); }}
            />
          : <button className="im-btn-add" onClick={() => { setSwapIndex(null); setShowPicker(true); }}>+ Add Exercise</button>
        }

        <div className="im-divider" style={{ margin: "16px 0" }} />
        <div className="im-section">
          <label className="im-input-label">Session Notes</label>
          <textarea
            className="im-textarea"
            placeholder="How did it feel? PR? Adjustments..."
            value={wkt.notes}
            onChange={e => setWkt(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>
        <div style={{ display: "flex", gap: 8, paddingBottom: 8 }}>
          <button className="im-btn-ghost" style={{ flex: 1 }} onClick={onDiscard}>Discard</button>
          <button
            className="im-btn-primary"
            style={{ flex: 2, opacity: totalSets === 0 || saving ? 0.5 : 1 }}
            onClick={handleSave}
            disabled={totalSets === 0 || saving}>
            {saving ? "Saving..." : `Save Session (${totalSets} sets)`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────────────────────
function HomeView({ workouts, measurements, onStartWorkout, onEditWorkout }) {
  const today = todayDay();
  const completedDays = workouts.filter(w => w.date === todayStr()).map(w => w.day);
  const latest = measurements[measurements.length - 1];
  const first = measurements[0];
  const recentWorkouts = workouts.slice(0, 5);

  return (
    <div>
      <div className="im-header">
        <div className="im-header-row">
          <div>
            <div className="im-logo">IRON <span className="im-logo-accent">MONK</span></div>
            <div className="im-tagline">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
          </div>
          <div className="im-streak">
            <div className="im-streak-num">{workouts.length}</div>
            <div className="im-streak-label">Sessions</div>
          </div>
        </div>
      </div>
      <div className="im-body">
        {latest && (
          <div className="im-section">
            <div className="im-stat-row">
              <div className="im-stat">
                <div className="im-stat-val">{latest.fields.weight}<span className="im-stat-unit">lb</span></div>
                <div className="im-stat-label">Weight</div>
                {first && <div className="im-stat-delta im-delta-neg">−{(first.fields.weight - latest.fields.weight).toFixed(1)}lb</div>}
              </div>
              <div className="im-stat">
                <div className="im-stat-val">{latest.fields.bodyFat}<span className="im-stat-unit">%</span></div>
                <div className="im-stat-label">Body Fat</div>
                {first && <div className="im-stat-delta im-delta-neg">−{(first.fields.bodyFat - latest.fields.bodyFat).toFixed(1)}%</div>}
              </div>
              <div className="im-stat">
                <div className="im-stat-val">{latest.fields.arms}<span className="im-stat-unit">"</span></div>
                <div className="im-stat-label">Arms</div>
                {first && <div className="im-stat-delta im-delta-pos">+{(latest.fields.arms - first.fields.arms).toFixed(1)}"</div>}
              </div>
            </div>
          </div>
        )}

        <div className="im-section">
          <div className="im-section-title">This Week</div>
          <div className="im-week">
            {DAYS_ORDER.map(day => {
              const plan = WEEKLY_PLAN[day];
              const isToday = day === today;
              const done = completedDays.includes(day);
              return (
                <div key={day} className={`im-day${done ? " done" : ""}${isToday ? " today" : ""}`}
                  onClick={() => !done && onStartWorkout(day)}>
                  <div className="im-day-name">{day.slice(0, 3)}</div>
                  <div className="im-day-muscle">{plan.muscle.slice(0, 4)}</div>
                  <div className="im-day-check">{done ? "✓" : isToday ? "→" : "·"}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="im-section">
          <div className="im-section-title">Today's Programme</div>
          {(() => {
            const plan = WEEKLY_PLAN[today] || WEEKLY_PLAN["Monday"];
            const done = completedDays.includes(today);
            const volSets = weeklyVolume(workouts, plan.muscle);
            return (
              <div className="im-card-accent">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div className="im-card-title">{plan.muscle} Day</div>
                    <div className="im-card-sub">{plan.focus}</div>
                  </div>
                  {!done
                    ? <button className="im-btn-copper" onClick={() => onStartWorkout(today)}>Begin</button>
                    : <span style={{ fontSize: 11, color: "var(--success)", border: "1px solid var(--success)", borderRadius: 2, padding: "4px 10px", letterSpacing: 1 }}>Done ✓</span>
                  }
                </div>
                <div className="im-divider" />
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontStyle: "italic" }}>{plan.note}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {plan.exercises.map((ex, i) => <span key={i} className="im-chip active" style={{ cursor: "default" }}>{ex}</span>)}
                </div>
                <div className="im-divider" />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="im-stat-label">Weekly Volume — {plan.muscle}</div>
                  <div style={{ fontSize: 11, color: volSets >= 10 ? "var(--success)" : "var(--copper)" }}>{volSets} / 12 sets</div>
                </div>
                <div className="im-vol-bar" style={{ marginTop: 6 }}>
                  <div className="im-vol-fill" style={{ width: `${Math.min(100, (volSets / 20) * 100)}%`, background: volSets >= 10 ? "var(--success)" : "var(--copper)" }} />
                </div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 4, letterSpacing: 1 }}>Target: 10–20 sets / week</div>
              </div>
            );
          })()}
        </div>

        <div className="im-section">
          <div className="im-section-title">Recent Sessions</div>
          {recentWorkouts.length === 0 && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>No sessions yet — tap Begin to log your first workout.</div>
          )}
          {recentWorkouts.map(w => {
            const topEx = w.exercises[0];
            const topSet = topEx ? [...topEx.sets].sort((a, b) => (b.weight || 0) - (a.weight || 0))[0] : null;
            const orm = topSet ? calc1RM(parseFloat(topSet.weight) || 0, parseInt(topSet.reps) || 1) : null;
            return (
              <div key={w.id} className="im-card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div className="im-card-title" style={{ fontSize: 15 }}>{w.day} — {w.muscle_group}</div>
                    <div className="im-card-sub">{fmtDateFull(w.date)}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    {orm && <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>1RM Est.</div>
                      <div style={{ fontFamily: "var(--ff-display)", fontSize: 18, color: "var(--copper)", fontWeight: 700 }}>{orm}<span style={{ fontSize: 11, color: "var(--text-muted)" }}>lb</span></div>
                    </div>}
                    <button onClick={() => onEditWorkout(w)}
                      style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 2, padding: "3px 10px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--ff-body)" }}>
                      Edit
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {w.exercises.map((ex, i) => <span key={i} className="im-chip" style={{ cursor: "default" }}>{ex.name}</span>)}
                </div>
                {w.notes ? <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>"{w.notes}"</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS VIEW ────────────────────────────────────────────────────────────
function ProgressView({ workouts, onEditWorkout, onDeleteWorkout }) {
  const [selectedLift, setSelectedLift] = useState("Barbell Bench Press");
  const [selectedMuscle, setSelectedMuscle] = useState("Chest");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const tooltipStyle = { background: "var(--parchment-dark)", border: "1px solid var(--border)", fontSize: 11, color: "var(--espresso)", fontFamily: "Lora", borderRadius: 2 };

  const liftData = [...workouts]
    .filter(w => w.exercises.some(e => e.name === selectedLift))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(w => {
      const ex = w.exercises.find(e => e.name === selectedLift);
      const topSet = [...ex.sets].sort((a, b) => (b.weight || 0) - (a.weight || 0))[0];
      const orm = topSet ? calc1RM(parseFloat(topSet.weight) || 0, parseInt(topSet.reps) || 1) : 0;
      return { date: fmtDate(w.date), top: parseFloat(topSet?.weight) || 0, "1rm": orm };
    });

  const latest = liftData[liftData.length - 1];
  const first = liftData[0];
  const topDelta = latest && first ? latest.top - first.top : 0;
  const strengthLevel = latest?.top ? getStrengthLevel(selectedLift, latest.top) : null;

  const muscleWorkouts = [...workouts].filter(w => w.muscle_group === selectedMuscle).sort((a, b) => a.date.localeCompare(b.date));
  const volumeData = muscleWorkouts.map(w => ({
    date: fmtDate(w.date),
    vol: w.exercises.reduce((acc, ex) => acc + ex.sets.reduce((a, s) => a + (parseInt(s.reps) || 0) * (parseFloat(s.weight) || 0), 0), 0),
  }));

  return (
    <div>
      <div className="im-header">
        <div className="im-header-row">
          <div>
            <div className="im-logo">Lift <span className="im-logo-accent">Progress</span></div>
            <div className="im-tagline">Performance over time</div>
          </div>
        </div>
      </div>
      <div className="im-body">
        <div className="im-section">
          <div className="im-section-title">Select Lift</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {["Barbell Bench Press", "Incline Barbell Press", "Barbell Deadlift", "Barbell Back Squat", "Barbell Row", "Barbell Overhead Press"].map(l => (
              <button key={l} className={`im-chip${l === selectedLift ? " active" : ""}`} onClick={() => setSelectedLift(l)}>
                {l.replace("Barbell ", "").replace(" Press", "")}
              </button>
            ))}
          </div>
          {latest ? (
            <div className="im-card-accent">
              <div className="im-chart-title">{selectedLift} — Top Set</div>
              <div style={{ display: "flex", alignItems: "baseline", marginBottom: 8 }}>
                <div className="im-chart-hero">{latest.top}<span>lb</span></div>
                <span className={`im-chart-delta ${topDelta >= 0 ? "im-delta-pos" : "im-delta-neg"}`}>{topDelta >= 0 ? "+" : ""}{topDelta}lb</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {strengthLevel && <span className={`im-strength-badge ${strengthBadgeClass(strengthLevel)}`}>{strengthLevel}</span>}
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Est. 1RM: <strong style={{ color: "var(--copper)" }}>{latest["1rm"]}lb</strong></span>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{(latest.top / USER.weight).toFixed(2)}× BW</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={liftData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs><linearGradient id="lG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b5762a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#b5762a" stopOpacity={0} />
                  </linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="top" stroke="var(--copper)" strokeWidth={2} fill="url(#lG)" dot={{ r: 4, fill: "var(--copper)", stroke: "var(--parchment)", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Log sessions to see progress charts.</div>
          )}
          {liftData.length > 1 && (
            <div className="im-chart-card">
              <div className="im-chart-title">Estimated 1RM Progress</div>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={liftData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="1rm" stroke="var(--espresso-mid)" strokeWidth={2} dot={{ r: 4, fill: "var(--espresso)", stroke: "var(--parchment)", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="im-section">
          <div className="im-section-title">Volume by Muscle Group</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"].map(m => (
              <button key={m} className={`im-chip${m === selectedMuscle ? " active" : ""}`} onClick={() => setSelectedMuscle(m)}>{m}</button>
            ))}
          </div>
          {volumeData.length > 0 ? (
            <div className="im-chart-card">
              <div className="im-chart-title">{selectedMuscle} — Total Volume (lbs)</div>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={volumeData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs><linearGradient id="vG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a3728" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4a3728" stopOpacity={0} />
                  </linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="vol" stroke="var(--espresso-mid)" strokeWidth={2} fill="url(#vG)" dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>No {selectedMuscle} sessions logged yet.</div>
          )}
        </div>

        <div className="im-section">
          <div className="im-section-title">Full Session History</div>
          {[...workouts].sort((a, b) => b.date.localeCompare(a.date)).map(w => (
            <div key={w.id} className="im-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "flex-start" }}>
                <div>
                  <div className="im-card-title" style={{ fontSize: 15 }}>{w.day} — {w.muscle_group}</div>
                  <div className="im-card-sub">{fmtDateFull(w.date)}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => onEditWorkout(w)}
                    style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 2, padding: "3px 10px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--ff-body)" }}>
                    Edit
                  </button>
                  <button onClick={() => setConfirmDeleteId(w.id)}
                    style={{ background: "transparent", border: "1px solid var(--danger)", borderRadius: 2, padding: "3px 10px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--danger)", cursor: "pointer", fontFamily: "var(--ff-body)" }}>
                    Delete
                  </button>
                </div>
              </div>
              {confirmDeleteId === w.id && (
                <div style={{ background: "rgba(138,48,32,0.08)", border: "1px solid var(--danger)", borderRadius: 2, padding: "10px 12px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--danger)" }}>Delete this session permanently?</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setConfirmDeleteId(null)}
                      style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 2, padding: "4px 10px", fontSize: 9, color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--ff-body)" }}>
                      Cancel
                    </button>
                    <button onClick={() => { onDeleteWorkout(w.id); setConfirmDeleteId(null); }}
                      style={{ background: "var(--danger)", border: "none", borderRadius: 2, padding: "4px 10px", fontSize: 9, color: "var(--parchment)", cursor: "pointer", fontFamily: "var(--ff-body)", letterSpacing: 1 }}>
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}
              {w.exercises.map((ex, i) => {
                const topSet = [...ex.sets].sort((a, b) => (b.weight || 0) - (a.weight || 0))[0];
                const orm = topSet ? calc1RM(parseFloat(topSet.weight) || 0, parseInt(topSet.reps) || 1) : null;
                return (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{ex.name}</div>
                      {orm && <div style={{ fontSize: 10, color: "var(--copper)" }}>1RM ~{orm}lb</div>}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {ex.sets.map((s, si) => (
                        <span key={si} className={`im-set-badge${s.toFailure ? " fail" : ""}`}>{s.reps}×{s.weight}{s.toFailure ? "✕" : ""}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {w.notes ? <div style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", marginTop: 6 }}>"{w.notes}"</div> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CALENDAR VIEW ────────────────────────────────────────────────────────────
function CalendarView({ workouts, onEditWorkout }) {
  const [displayDate, setDisplayDate] = useState(new Date());

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const monthName = displayDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map workout dates to lookup
  const workoutMap = {};
  workouts.forEach(w => {
    if (!workoutMap[w.date]) workoutMap[w.date] = [];
    workoutMap[w.date].push(w);
  });

  const muscleColors = {
    Chest: "#b5762a", Back: "#4a3728", Legs: "#5a7a3a",
    Shoulders: "#7a5a8a", Arms: "#8a4a2a", Core: "#4a6a7a",
  };

  function dateStr(d) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  const today = todayStr();
  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const [selectedDay, setSelectedDay] = useState(null);
  const selectedWorkouts = selectedDay ? (workoutMap[dateStr(selectedDay)] || []) : [];

  return (
    <div>
      <div className="im-header">
        <div className="im-header-row">
          <div>
            <div className="im-logo">Workout <span className="im-logo-accent">History</span></div>
            <div className="im-tagline">Calendar view</div>
          </div>
        </div>
      </div>
      <div className="im-body">
        {/* Month navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={() => setDisplayDate(new Date(year, month - 1, 1))}
            style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 2, padding: "6px 14px", fontSize: 16, color: "var(--text-muted)", cursor: "pointer" }}>‹</button>
          <div style={{ fontFamily: "var(--ff-display)", fontSize: 18, fontWeight: 700, color: "var(--espresso)" }}>{monthName}</div>
          <button onClick={() => setDisplayDate(new Date(year, month + 1, 1))}
            style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 2, padding: "6px 14px", fontSize: 16, color: "var(--text-muted)", cursor: "pointer" }}>›</button>
        </div>

        {/* Day of week headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 3 }}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 20 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={`e${i}`} />;
            const ds = dateStr(d);
            const wkts = workoutMap[ds] || [];
            const isToday = ds === today;
            const isSelected = selectedDay === d;
            const hasWorkout = wkts.length > 0;
            const muscle = wkts[0]?.muscle_group;
            const dotColor = muscleColors[muscle] || "var(--copper)";

            return (
              <div key={d}
                onClick={() => setSelectedDay(isSelected ? null : d)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 3,
                  border: isSelected ? "2px solid var(--copper)" : isToday ? "2px solid var(--espresso)" : "1px solid var(--border-light)",
                  background: hasWorkout ? "var(--parchment-dark)" : "transparent",
                  cursor: hasWorkout ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 2px",
                  position: "relative",
                }}>
                <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? "var(--espresso)" : hasWorkout ? "var(--espresso-mid)" : "var(--text-muted)" }}>{d}</div>
                {hasWorkout && (
                  <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                    {wkts.slice(0, 2).map((_, wi) => (
                      <div key={wi} style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {Object.entries(muscleColors).map(([muscle, color]) => (
            <div key={muscle} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)" }}>{muscle}</span>
            </div>
          ))}
        </div>

        {/* Selected day detail */}
        {selectedDay && (
          <div className="im-section">
            <div className="im-section-title">{fmtDateFull(dateStr(selectedDay))}</div>
            {selectedWorkouts.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>No sessions logged.</div>
            ) : selectedWorkouts.map(w => (
              <div key={w.id} className="im-card-accent">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div className="im-card-title">{w.day} — {w.muscle_group}</div>
                    <div className="im-card-sub">{w.exercises.length} exercises · {w.exercises.reduce((a, e) => a + e.sets.length, 0)} sets</div>
                  </div>
                  <button onClick={() => onEditWorkout(w)}
                    style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 2, padding: "3px 10px", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--ff-body)" }}>
                    Edit
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {w.exercises.map((ex, i) => {
                    const topSet = [...ex.sets].sort((a, b) => (b.weight || 0) - (a.weight || 0))[0];
                    const orm = topSet ? calc1RM(parseFloat(topSet.weight) || 0, parseInt(topSet.reps) || 1) : null;
                    return (
                      <div key={i} style={{ background: "var(--parchment)", border: "1px solid var(--border)", borderRadius: 2, padding: "4px 10px", marginBottom: 4 }}>
                        <div style={{ fontSize: 10, color: "var(--espresso-mid)", fontWeight: 600 }}>{ex.name}</div>
                        <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 1 }}>
                          {ex.sets.length} sets{orm ? ` · 1RM ~${orm}lb` : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {w.notes && <div style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", marginTop: 8 }}>"{w.notes}"</div>}
              </div>
            ))}
          </div>
        )}

        {/* Monthly summary stats */}
        <div className="im-section">
          <div className="im-section-title">This Month</div>
          {(() => {
            const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
            const monthWorkouts = workouts.filter(w => w.date.startsWith(monthPrefix));
            const totalSets = monthWorkouts.reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.length, 0), 0);
            const muscles = [...new Set(monthWorkouts.map(w => w.muscle_group))];
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div className="im-stat">
                  <div className="im-stat-val">{monthWorkouts.length}</div>
                  <div className="im-stat-label">Sessions</div>
                </div>
                <div className="im-stat">
                  <div className="im-stat-val">{totalSets}</div>
                  <div className="im-stat-label">Total Sets</div>
                </div>
                <div className="im-stat">
                  <div className="im-stat-val">{muscles.length}</div>
                  <div className="im-stat-label">Muscles Hit</div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}


function BodyView({ measurements, measurementFields, setMeasurements, setMeasurementFields }) {
  const [showForm, setShowForm] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [form, setForm] = useState(Object.fromEntries([["date", todayStr()], ...measurementFields.map(f => [f, ""])]));
  const [selectedMetric, setSelectedMetric] = useState("weight");
  const [saving, setSaving] = useState(false);

  const latest = measurements[measurements.length - 1];
  const first = measurements[0];

  async function saveEntry() {
    setSaving(true);
    const fields = Object.fromEntries(measurementFields.map(f => [f, parseFloat(form[f]) || 0]));
    const newEntry = { id: `m${Date.now()}`, date: form.date, fields };
    const { error } = await supabase.from("measurements").insert(newEntry);
    if (!error) {
      setMeasurements(prev => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)));
    }
    setSaving(false);
    setShowForm(false);
  }

  async function addCustomField() {
    const key = newFieldName.toLowerCase().replace(/\s+/g, "_");
    if (!key || measurementFields.includes(key)) return;
    const newFields = [...measurementFields, key];
    setMeasurementFields(newFields);
    setForm(prev => ({ ...prev, [key]: "" }));
    await supabase.from("user_config").upsert({ key: "measurement_fields", value: newFields });
    setNewFieldName("");
    setShowAddField(false);
  }

  const tooltipStyle = { background: "var(--parchment-dark)", border: "1px solid var(--border)", fontSize: 11, color: "var(--espresso)", fontFamily: "Lora", borderRadius: 2 };
  const chartData = measurements.map(m => ({ date: fmtDate(m.date), val: m.fields[selectedMetric] || 0 }));
  const latestVal = latest?.fields[selectedMetric];
  const firstVal = first?.fields[selectedMetric];
  const delta = latestVal && firstVal ? latestVal - firstVal : null;
  const unit = MEASUREMENT_UNITS[selectedMetric] || '"';
  const deltaPositive = ["arms", "chest", "legs", "calves", "shoulders"].includes(selectedMetric) ? delta > 0 : delta < 0;

  return (
    <div>
      <div className="im-header">
        <div className="im-header-row">
          <div>
            <div className="im-logo">Body <span className="im-logo-accent">Data</span></div>
            <div className="im-tagline">Measurements & Composition</div>
          </div>
          <button className="im-btn-sm" onClick={() => setShowForm(true)}>+ Log</button>
        </div>
      </div>
      <div className="im-body">
        {showForm && (
          <div className="im-section">
            <div className="im-card-accent">
              <div className="im-section-title">New Entry</div>
              <div style={{ marginBottom: 10 }}>
                <label className="im-input-label">Date</label>
                <input type="date" className="im-input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {measurementFields.map(f => (
                  <div key={f}>
                    <label className="im-input-label">{f.replace(/_/g, " ")} {MEASUREMENT_UNITS[f] || '"'}</label>
                    <input type="number" step="0.1" className="im-input" value={form[f] || ""}
                      placeholder={latest?.fields[f] || "0"} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} />
                  </div>
                ))}
              </div>
              {showAddField ? (
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <input className="im-input" placeholder="e.g. forearms" value={newFieldName} onChange={e => setNewFieldName(e.target.value)} />
                  <button className="im-btn-copper" onClick={addCustomField}>Add</button>
                </div>
              ) : (
                <button className="im-btn-add" style={{ marginTop: 10 }} onClick={() => setShowAddField(true)}>+ Add Custom Field</button>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button className="im-btn-ghost" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
                <button className="im-btn-primary" style={{ flex: 2, opacity: saving ? 0.5 : 1 }} onClick={saveEntry} disabled={saving}>
                  {saving ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </div>
          </div>
        )}

        {latest && (
          <div className="im-section">
            <div className="im-section-title">Current Stats</div>
            <div className="im-stat-row">
              {["weight", "bodyFat", "arms"].map(f => {
                const cur = latest?.fields[f];
                const orig = first?.fields[f];
                const d = cur && orig ? (cur - orig).toFixed(1) : null;
                const pos = f === "arms" ? d > 0 : d < 0;
                return (
                  <div key={f} className="im-stat">
                    <div className="im-stat-val">{cur}<span className="im-stat-unit">{MEASUREMENT_UNITS[f]}</span></div>
                    <div className="im-stat-label">{f === "bodyFat" ? "Body Fat" : f}</div>
                    {d !== null && <div className={`im-stat-delta ${pos ? "im-delta-pos" : "im-delta-neg"}`}>{d > 0 ? "+" : ""}{d}{MEASUREMENT_UNITS[f]}</div>}
                  </div>
                );
              })}
            </div>
            <div className="im-stat-row">
              {["chest", "waist", "legs"].map(f => {
                const cur = latest?.fields[f];
                const orig = first?.fields[f];
                const d = cur && orig ? (cur - orig).toFixed(1) : null;
                const pos = f !== "waist" ? d > 0 : d < 0;
                return (
                  <div key={f} className="im-stat">
                    <div className="im-stat-val-sm">{cur}<span className="im-stat-unit">"</span></div>
                    <div className="im-stat-label">{f}</div>
                    {d !== null && <div className={`im-stat-delta ${pos ? "im-delta-pos" : "im-delta-neg"}`}>{d > 0 ? "+" : ""}{d}"</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="im-section">
          <div className="im-section-title">Trend Chart</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {measurementFields.map(f => (
              <button key={f} className={`im-chip${f === selectedMetric ? " active" : ""}`} onClick={() => setSelectedMetric(f)}>
                {f.replace(/_/g, " ")}
              </button>
            ))}
          </div>
          {chartData.length > 0 ? (
            <div className="im-card-accent">
              <div className="im-chart-title">{selectedMetric.replace(/_/g, " ")} over time</div>
              <div style={{ display: "flex", alignItems: "baseline", marginBottom: 12 }}>
                <div className="im-chart-hero">{latestVal}<span>{unit}</span></div>
                {delta !== null && (
                  <span className={`im-chart-delta ${deltaPositive ? "im-delta-pos" : "im-delta-neg"}`}>
                    {delta > 0 ? "+" : ""}{delta.toFixed(1)}{unit}
                  </span>
                )}
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs><linearGradient id="bG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b5762a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#b5762a" stopOpacity={0} />
                  </linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="val" stroke="var(--copper)" strokeWidth={2} fill="url(#bG)" dot={{ r: 4, fill: "var(--copper)", stroke: "var(--parchment)", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Log measurements to see trends.</div>
          )}
        </div>

        <div className="im-section">
          <div className="im-section-title">History</div>
          {measurements.length === 0 && <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>No measurements logged yet.</div>}
          {[...measurements].reverse().map(m => (
            <div key={m.id} className="im-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div className="im-card-title" style={{ fontSize: 15 }}>{fmtDateFull(m.date)}</div>
                <div style={{ fontFamily: "var(--ff-display)", fontSize: 20, color: "var(--copper)", fontWeight: 700 }}>
                  {m.fields.weight}<span style={{ fontSize: 12, color: "var(--text-muted)" }}>lb</span>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {Object.entries(m.fields).filter(([k]) => k !== "weight").map(([k, v]) => (
                  <div key={k} style={{ fontSize: 10, background: "var(--parchment)", border: "1px solid var(--border)", borderRadius: 2, padding: "3px 8px", display: "flex", gap: 4 }}>
                    <span style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, fontSize: 9 }}>{k.replace(/_/g, " ")}</span>
                    <span style={{ color: "var(--espresso-mid)", fontWeight: 600 }}>{v}{MEASUREMENT_UNITS[k] || '"'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home");
  const [workouts, setWorkouts] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [measurementFields, setMeasurementFields] = useState(DEFAULT_MEASUREMENT_FIELDS);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const timer = useRestTimer();

  useEffect(() => {
    async function loadData() {
      const [{ data: wData }, { data: mData }, { data: cData }] = await Promise.all([
        supabase.from("workouts").select("*").order("date", { ascending: false }),
        supabase.from("measurements").select("*").order("date", { ascending: true }),
        supabase.from("user_config").select("*").eq("key", "measurement_fields"),
      ]);
      if (wData) setWorkouts(wData);
      if (mData) setMeasurements(mData);
      if (cData && cData[0]) setMeasurementFields(cData[0].value);
      setLoading(false);
    }
    loadData();
  }, []);

  function startWorkout(day) {
    const plan = WEEKLY_PLAN[day];
    const lastSimilar = workouts.filter(w => w.day === day)[0];
    const newWorkout = {
      id: `w${Date.now()}`, date: todayStr(), day, muscleGroup: plan.muscle, notes: "",
      exercises: plan.exercises.map(name => {
        const lastEx = lastSimilar?.exercises.find(e => e.name === name);
        const recWeight = lastEx ? Math.max(...lastEx.sets.map(s => parseFloat(s.weight) || 0)) : getBaseWeight(name);
        return { name, recWeight, sets: [] };
      }),
    };
    setActiveWorkout(newWorkout);
    setView("log");
  }

  function editWorkout(w) {
    // Normalize stored workout into activeWorkout shape
    setActiveWorkout({
      id: w.id,
      date: w.date,
      day: w.day,
      muscleGroup: w.muscle_group,
      notes: w.notes || "",
      exercises: w.exercises.map(ex => ({
        name: ex.name,
        recWeight: ex.recWeight || Math.max(...(ex.sets || []).map(s => parseFloat(s.weight) || 0), 0),
        sets: ex.sets || [],
      })),
    });
    setView("log");
  }

  function editWorkout(w) {
    // Load existing workout into log view for editing
    setActiveWorkout({
      id: w.id, date: w.date, day: w.day,
      muscleGroup: w.muscle_group, notes: w.notes || "",
      exercises: w.exercises,
    });
    setView("log");
  }

  async function saveWorkout(wkt) {
    const { error } = await supabase.from("workouts").upsert({
      id: wkt.id, date: wkt.date, day: wkt.day,
      muscle_group: wkt.muscleGroup, notes: wkt.notes || "",
      exercises: wkt.exercises,
    });
    if (!error) {
      setWorkouts(prev => {
        const filtered = prev.filter(w => w.id !== wkt.id);
        return [{ ...wkt, muscle_group: wkt.muscleGroup }, ...filtered];
      });
    }
    setActiveWorkout(null);
    setView("home");
  }

  async function deleteWorkout(id) {
    await supabase.from("workouts").delete().eq("id", id);
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }

  function discardWorkout() {
    setActiveWorkout(null);
    setView("home");
  }

  if (loading) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className="im-app">
          <div className="im-loading">Loading Iron Monk...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="im-app">
        {view === "home" && <HomeView workouts={workouts} measurements={measurements} onStartWorkout={startWorkout} onEditWorkout={editWorkout} />}
        {view === "log" && <LogView activeWorkout={activeWorkout} workouts={workouts} onSave={saveWorkout} onDiscard={discardWorkout} timer={timer} />}
        {view === "progress" && <ProgressView workouts={workouts} onEditWorkout={editWorkout} onDeleteWorkout={deleteWorkout} />}
        {view === "calendar" && <CalendarView workouts={workouts} onEditWorkout={editWorkout} />}
        {view === "body" && <BodyView measurements={measurements} measurementFields={measurementFields} setMeasurements={setMeasurements} setMeasurementFields={setMeasurementFields} />}

        <nav className="im-nav">
          {[
            { id: "home",     icon: "⌂", label: "Home" },
            { id: "log",      icon: "✦", label: "Log" },
            { id: "calendar", icon: "◫", label: "History" },
            { id: "progress", icon: "↗", label: "Progress" },
            { id: "body",     icon: "◎", label: "Body" },
          ].map(n => (
            <button key={n.id} className={`im-nav-btn${view === n.id ? " active" : ""}`} onClick={() => setView(n.id)}>
              <span className="im-nav-icon">{n.icon}</span>
              <span className="im-nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}