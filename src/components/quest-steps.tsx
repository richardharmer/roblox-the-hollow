"use client";

import { useSyncExternalStore } from "react";
import { Check, ArrowDown } from "lucide-react";

const empty = () => "[]";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("hollow-step-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("hollow-step-change", callback);
  };
}
export function QuestSteps({ id, steps }: { id: string; steps: string[] }) {
  const key = `hollow-steps:${id}`;
  const raw = useSyncExternalStore(subscribe, () => {
    try { return localStorage.getItem(key) ?? "[]"; } catch { return "[]"; }
  }, empty);
  let saved: string[] = [];
  try { const value: unknown = JSON.parse(raw); if (Array.isArray(value)) saved = value.filter((x): x is string => typeof x === "string"); } catch { /* Corrupt storage starts fresh. */ }
  const done = steps.filter((step) => saved.includes(step)).length;
  const next = steps.findIndex((step) => !saved.includes(step));
  function toggle(step: string) {
    const updated = saved.includes(step) ? saved.filter((item) => item !== step) : [...saved, step];
    try {
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new Event("hollow-step-change"));
    } catch { /* Browsing with storage blocked still leaves every step readable. */ }
  }
  return <section className="quest-stepper" aria-label="Step-by-step task checklist">
    <div className="stepper-toolbar">
      <div><strong>Follow the steps</strong><p role="status" aria-live="polite">{done} of {steps.length} completed</p></div>
      {next >= 0 && <a className="text-link" href={`#${id}-step-${next + 1}`}>Next unfinished step <ArrowDown size={16} aria-hidden="true" /></a>}
    </div>
    <progress value={done} max={steps.length} aria-label="Your checklist progress" />
    <p className="stepper-note">Tick each action as you go. Saved on this browser; your checklist does not verify an in-game claim.</p>
    <ol className="step-list step-cards">
      {steps.map((step, index) => {
        const split = step.match(/^(.+?[.!?])(?:\s+|$)([\s\S]*)$/);
        const title = split?.[1] ?? step;
        const body = split?.[2];
        const checked = saved.includes(step);
        return <li key={step} id={`${id}-step-${index + 1}`} className={checked ? "step-complete" : ""}>
          <span className="step-number" aria-hidden="true">{checked ? <Check size={20} /> : String(index + 1).padStart(2, "0")}</span>
          <div className="step-content"><h3>{title}</h3>{body && <p>{body}</p>}
            <label className="step-done"><input type="checkbox" checked={checked} onChange={() => toggle(step)} />Step {index + 1} done</label>
          </div>
        </li>;
      })}
    </ol>
  </section>;
}
