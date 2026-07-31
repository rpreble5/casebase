import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRun } from "../../state/runStore";
import { catalogItem } from "../../data/orderCatalog";
import { TriangleIcon } from "../ui/Icon";
import { play } from "../../audio/sounds";
import "./ChartPanel.css";

type Tab = "patient" | "labs" | "orders" | "vitals";

const TABS: { id: Tab; label: string }[] = [
  { id: "patient", label: "Patient" },
  { id: "labs", label: "Labs" },
  { id: "orders", label: "Orders" },
  { id: "vitals", label: "Vitals" },
];

export function ChartPanel() {
  const caseData = useRun((s) => s.caseData);
  const revealedDraws = useRun((s) => s.revealedDraws);
  const orders = useRun((s) => s.orders);
  const [tab, setTab] = useState<Tab>("patient");
  const [seenDraws, setSeenDraws] = useState(0);

  // New results announce themselves in the dialogue; the tab just picks up a
  // badge so the table never has to interrupt the conversation.
  const unseen = revealedDraws - seenDraws;

  useEffect(() => {
    if (tab === "labs") setSeenDraws(revealedDraws);
  }, [tab, revealedDraws]);

  if (!caseData) return null;

  return (
    <aside className="chart">
      <div className="chart__tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`chart__tab ${tab === t.id ? "is-on" : ""}`}
            onClick={() => {
              play("chartOpen");
              setTab(t.id);
            }}
          >
            {t.label}
            {t.id === "labs" && unseen > 0 && <span className="chart__badge">{unseen}</span>}
            {t.id === "orders" && orders.length > 0 && (
              <span className="chart__badge chart__badge--quiet">{orders.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="chart__body">
        {tab === "patient" && <PatientTab />}
        {tab === "labs" && <LabsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "vitals" && <VitalsTab />}
      </div>
    </aside>
  );
}

function PatientTab() {
  const p = useRun((s) => s.caseData!.patient);
  return (
    <div className="pt">
      <h3>{p.name}</h3>
      <p className="pt__line">{p.line}</p>
      <dl>
        <dt>Weight</dt>
        <dd>{p.weightKg} kg</dd>
        <dt>Allergies</dt>
        <dd>{p.allergies}</dd>
      </dl>
      <h4>History</h4>
      <ul>
        {p.history.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <h4>Home medications</h4>
      <ul>
        {p.meds.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      {p.social && (
        <>
          <h4>Social</h4>
          <p className="pt__social">{p.social}</p>
        </>
      )}
    </div>
  );
}

/**
 * The quiet zone.
 *
 * Thinner border, no accent colour, no chunky drop shadow, one uniform weight,
 * tabular numerals. It deliberately refuses the rest of the app's costume, which
 * is exactly why it reads as the patient's real chemistry rather than as scoring
 * UI. Abnormal is one red plus a direction triangle — no second hue, no bold.
 */
function LabsTab() {
  const c = useRun((s) => s.caseData!);
  const n = useRun((s) => s.revealedDraws);
  const unlocked = useRun((s) => s.unlockedAnalytes);
  const draws = c.draws.slice(0, n);
  const analytes = c.analytes.filter((a) => !a.hidden || unlocked.includes(a.id));

  if (draws.length === 0) {
    return <p className="chart__empty">Nothing resulted yet.</p>;
  }

  return (
    <div className="labs">
      <div className="labs__head">
        <b>Chemistry &amp; gas</b>
        <em>
          {draws.length === 1
            ? draws[0].time
            : `${draws.length} draws · ${draws[0].time} → ${draws[draws.length - 1].time}`}
        </em>
      </div>
      <div className="labs__scroll">
        <table>
          <thead>
            <tr>
              <th>Analyte</th>
              {draws.map((d) => (
                <th key={d.time}>{d.time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {analytes.map((a) => (
              <tr key={a.id}>
                <td title={`Reference: ${a.ref}`}>{a.name}</td>
                {draws.map((d) => {
                  const v = d.values[a.id];
                  if (v === undefined) return <td key={d.time}>—</td>;
                  const high = a.high !== undefined && v > a.high;
                  const low = a.low !== undefined && v < a.low;
                  return (
                    <td key={d.time} className={high || low ? "ab" : undefined}>
                      {v.toFixed(a.decimals ?? 0)}
                      {(high || low) && (
                        <span className="flag">
                          <TriangleIcon dir={high ? "up" : "down"} />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab() {
  const orders = useRun((s) => s.orders);
  if (orders.length === 0) return <p className="chart__empty">No orders placed yet.</p>;
  return (
    <ul className="orders">
      {orders.map((id) => {
        const it = catalogItem(id);
        return (
          <li key={id}>
            <b>{it.name}</b>
            <em>{it.category}</em>
          </li>
        );
      })}
    </ul>
  );
}

function VitalsTab() {
  const v = useRun((s) => s.caseData!.vitals);
  return (
    <div className="labs">
      <div className="labs__scroll">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>HR</th>
              <th>BP</th>
              <th>RR</th>
              <th>SpO₂</th>
            </tr>
          </thead>
          <tbody>
            {v.map((row) => (
              <tr key={row.time}>
                <td>{row.time}</td>
                <td className={row.hr > 100 ? "ab" : undefined}>{row.hr}</td>
                <td>{row.bp}</td>
                <td className={row.rr > 20 ? "ab" : undefined}>{row.rr}</td>
                <td>{row.spo2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ChartToggle({ onClick }: { onClick: () => void }) {
  return (
    <motion.button className="chunk chart__toggle" onClick={onClick} whileTap={{ scale: 0.96 }}>
      Chart
    </motion.button>
  );
}
