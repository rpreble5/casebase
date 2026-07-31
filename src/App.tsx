import { useEffect, useState } from "react";
import { useRun } from "./state/runStore";
import { CASES } from "./data/cases";
import { Header } from "./components/Header";
import { Conversation } from "./components/Conversation/Conversation";
import { ChartPanel } from "./components/Chart/ChartPanel";
import { installDevHook } from "./telemetry/log";
import { validateCase } from "./data/interpolate";
import "./App.css";

export default function App() {
  const begin = useRun((s) => s.begin);
  const [chartOpen, setChartOpen] = useState(false);

  useEffect(() => {
    // Fresh every load while the slice is being built. Resume comes back on
    // once the case is long enough that losing your place matters.
    begin(CASES[0], { fresh: true });
    installDevHook();
    // A number that looks right but isn't is the failure mode worth catching.
    const problems = CASES.flatMap((c) => validateCase(c).map((p) => `${c.id}: ${p}`));
    if (problems.length) console.error("Case validation failed:\n" + problems.join("\n"));
  }, [begin]);

  return (
    <div className="app">
      <Header onToggleChart={() => setChartOpen((o) => !o)} />
      <div className="app__body">
        <Conversation />
        <div className={`chart-host ${chartOpen ? "is-open" : ""}`}>
          <ChartPanel />
        </div>
      </div>
      {chartOpen && <div className="app__scrim" onClick={() => setChartOpen(false)} />}
    </div>
  );
}
