"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import MeasureCard from "@/components/MeasureCard"
import { BUDGET, measures } from "@/data/measures"
import {
  calculateResults,
  formatMoney,
  formatTons
} from "@/lib/calculations"
import { supabase } from "@/lib/supabase/client"

function getParticipantId() {
  const key = "decarbonize-participant-id"
  const existing = localStorage.getItem(key)

  if (existing) {
    return existing
  }

  const id = crypto.randomUUID()
  localStorage.setItem(key, id)
  return id
}

export default function Home() {
  const router = useRouter()
  const [participantId, setParticipantId] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [round, setRound] = useState<1 | 2>(1)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setParticipantId(getParticipantId())
  }, [])

  const results = useMemo(
    () =>
      calculateResults(
        selected,
        measures,
        BUDGET,
        round === 2
      ),
    [selected, round]
  )

  const budgetUsed = Math.min(
    100,
    Math.max(0, (results.cost / BUDGET) * 100)
  )

  function toggleMeasure(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )

    setSubmitted(false)
    setError("")
  }

  async function submitPlan() {
    if (!participantId) {
      return
    }

    setSaving(true)
    setError("")

    const { error: submitError } = await supabase
      .from("submissions")
      .upsert(
        {
          participant_id: participantId,
          round,
          selected_measures: selected,
          total_cost: results.cost,
          annual_savings: results.annualSavings,
          total_co2: results.co2Reduction
        },
        {
          onConflict: "participant_id,round"
        }
      )

    setSaving(false)

    if (submitError) {
      setError(submitError.message)
      return
    }

    setSubmitted(true)
  }

  function startRoundTwo() {
    setRound(2)
    setSelected([])
    setSubmitted(false)
    setError("")

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="eyebrow">
              EAS 574 · CLASSROOM ACTIVITY
            </p>

            <h1>DECARBONIZE YOUR HOME</h1>

            <p className="hero-text">
              You have a limited budget. Which upgrades would you
              choose to reduce your household's carbon emissions?
            </p>

            <div className="hero-actions">
              <button
                className="secondary-button"
                onClick={() => router.push("/results")}
              >
                View Class Results
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="game-section">
        <div className="container">
          <div className="round-header">
            <div>
              <span className="round-label">
                ROUND {round}
              </span>

              <h2>
                {round === 1
                  ? "Build your decarbonization plan"
                  : "Now add government incentives"}
              </h2>

              <p>
                {round === 1
                  ? "Choose the measures you would actually consider for your home."
                  : "Government incentives reduce the upfront cost of eligible measures. Would your choices change?"}
              </p>
            </div>
          </div>

          <div className="budget-summary">
            <div className="budget-top">
              <div>
                <span>Budget</span>
                <strong>{formatMoney(BUDGET)}</strong>
              </div>

              <div className="budget-used">
                <span>Remaining</span>
                <strong
                  className={
                    results.remainingBudget < 0
                      ? "over-budget"
                      : ""
                  }
                >
                  {formatMoney(results.remainingBudget)}
                </strong>
              </div>
            </div>

            <div className="budget-bar">
              <div
                className="budget-bar-fill"
                style={{
                  width: `${budgetUsed}%`
                }}
              />
            </div>

            <small>
              {formatMoney(results.cost)} of{" "}
              {formatMoney(BUDGET)} used
            </small>
          </div>

          <div className="plan-summary">
            <div>
              <span>Selected measures</span>
              <strong>{selected.length}</strong>
            </div>

            <div>
              <span>Upfront cost</span>
              <strong>{formatMoney(results.cost)}</strong>
            </div>

            <div>
              <span>Annual savings</span>
              <strong>
                {formatMoney(results.annualSavings)}
              </strong>
            </div>

            <div>
              <span>Annual CO₂ reduction</span>
              <strong>
                {formatTons(results.co2Reduction)}
              </strong>
            </div>
          </div>

          <div className="measures-header">
            <div>
              <span className="section-label">
                CHOOSE YOUR MEASURES
              </span>

              <h2>What would you invest in?</h2>
            </div>

            <p>
              You can select multiple measures as long as you stay
              within your budget.
            </p>
          </div>

          <div className="measure-grid">
            {measures.map((measure) => (
              <MeasureCard
                key={measure.id}
                measure={measure}
                selected={selected.includes(measure.id)}
                incentivesEnabled={round === 2}
                disabled={
                  !selected.includes(measure.id) &&
                  results.cost +
                    (round === 2
                      ? Math.max(
                          0,
                          measure.cost - measure.incentive
                        )
                      : measure.cost) >
                    BUDGET
                }
                onToggle={() => toggleMeasure(measure.id)}
              />
            ))}
          </div>

          <div className="decision-summary">
            <div className="decision-summary-main">
              <span className="section-label">
                YOUR PLAN
              </span>

              <h2>
                {selected.length === 0
                  ? "You haven't selected anything yet."
                  : `${selected.length} measure${
                      selected.length === 1 ? "" : "s"
                    } selected`}
              </h2>

              <p>
                {selected.length === 0
                  ? "Choose at least one measure to build your plan."
                  : `Your plan costs ${formatMoney(
                      results.cost
                    )} and reduces approximately ${formatTons(
                      results.co2Reduction
                    )} of CO₂ per year.`}
              </p>
            </div>
          </div>

          {error && (
            <div className="error-message">
              Something went wrong: {error}
            </div>
          )}

          <div className="submit-section">
            <button
              className="primary-button"
              onClick={submitPlan}
              disabled={
                saving ||
                selected.length === 0 ||
                results.remainingBudget < 0
              }
            >
              {saving
                ? "Submitting..."
                : submitted
                  ? "Update My Plan"
                  : "Submit My Plan"}
            </button>

            {submitted && (
              <p className="submit-message">
                Your response has been recorded. You can change
                your selections and submit again at any time.
              </p>
            )}

            {!submitted && selected.length > 0 && (
              <p className="submit-message">
                Your response is anonymous. You can update it later.
              </p>
            )}
          </div>

          {round === 1 && submitted && (
            <div className="round-two-card">
              <div>
                <span className="section-label">
                  NEXT ROUND
                </span>

                <h2>
                  What if the government helps pay?
                </h2>

                <p>
                  See how financial incentives change the upfront
                  cost of each measure, then build your plan again.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={startRoundTwo}
              >
                Start Round 2
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}