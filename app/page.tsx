"use client"

import { useMemo, useState } from "react"
import MeasureCard from "@/components/MeasureCard"
import ClassResults, {
  type Aggregate
} from "@/components/ClassResults"
import {
  BUDGET,
  measures
} from "@/data/measures"
import {
  calculateResults,
  formatMoney,
  formatTons,
  formatNumber,
  getVehicleEquivalent
} from "@/lib/calculations"

const MOCK_RESULTS_ROUND_1: Aggregate = {
  participants: 0,
  totalCost: 0,
  totalSavings: 0,
  totalCO2: 0,
  adoption: {}
}

const MOCK_RESULTS_ROUND_2: Aggregate = {
  participants: 0,
  totalCost: 0,
  totalSavings: 0,
  totalCO2: 0,
  adoption: {}
}

export default function Home() {
  const [selected, setSelected] =
    useState<string[]>([])

  const [roundOneSelection, setRoundOneSelection] =
    useState<string[]>([])

  const [submitted, setSubmitted] =
    useState(false)

  const [round, setRound] =
    useState<1 | 2>(1)

  const incentivesEnabled = round === 2

  const results = useMemo(
    () =>
      calculateResults(
        selected,
        measures,
        BUDGET,
        incentivesEnabled
      ),
    [selected, incentivesEnabled]
  )

  const budgetUsed = Math.min(
    Math.max(
      (results.cost / BUDGET) * 100,
      0
    ),
    100
  )

  const vehicleEquivalent =
    getVehicleEquivalent(
      results.co2Reduction
    )

  const measureNames = Object.fromEntries(
    measures.map((measure) => [
      measure.id,
      measure.name
    ])
  )

  const aggregate =
    round === 1
      ? MOCK_RESULTS_ROUND_1
      : MOCK_RESULTS_ROUND_2

  function toggle(id: string) {
    if (submitted) return

    setSelected((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [
            ...current,
            id
          ]
    )
  }

  function submit() {
    if (results.remainingBudget < 0) {
      return
    }

    if (round === 1) {
      setRoundOneSelection(selected)
    }

    setSubmitted(true)
  }

  function startRoundTwo() {
    setRound(2)
    setSelected([])
    setSubmitted(false)
  }

  return (
    <main>
      <header className="hero">
        <div className="hero-inner">
          <span className="eyebrow">
            EAS 574 • CLASS ACTIVITY
          </span>

          <h1>
            DECARBONIZE
            <br />
            YOUR HOUSE
          </h1>

          <p>
            You have a limited budget.
            Choose the improvements you would
            actually consider for your home, then
            see the financial and climate impact
            of your decisions.
          </p>
        </div>
      </header>

      <div className="container">
        <section className="intro-row">
          <div>
            <span className="round-label">
              ROUND {round}
            </span>

            <h2>
              {incentivesEnabled
                ? "Government incentives are now available."
                : "What would you choose?"}
            </h2>

            <p>
              {incentivesEnabled
                ? "Some higher-cost options now receive incentives. Would lower upfront costs change your decision?"
                : "There is no single right answer. Balance upfront cost, annual savings, payback, and CO₂ reduction."}
            </p>
          </div>

          <div className="budget">
            <span>
              REMAINING BUDGET
            </span>

            <strong
              className={
                results.remainingBudget < 0
                  ? "over"
                  : ""
              }
            >
              {formatMoney(
                results.remainingBudget
              )}
            </strong>

            <div className="budget-bar">
              <div
                className="budget-bar-fill"
                style={{
                  width: `${budgetUsed}%`
                }}
              />
            </div>

            <small>
              {formatMoney(
                results.cost
              )}{" "}
              of{" "}
              {formatMoney(BUDGET)}{" "}
              committed
            </small>
          </div>
        </section>

        {incentivesEnabled && (
          <div className="incentive-banner">
            <div className="incentive-icon">
              $
            </div>

            <div>
              <strong>
                Government incentives
              </strong>

              <span>
                Incentives apply to selected
                higher-cost options in this
                simplified classroom scenario.
              </span>
            </div>
          </div>
        )}

        <section className="plan-summary">
          <div>
            <span className="eyebrow">
              YOUR PLAN
            </span>

            <h2>
              {selected.length === 0
                ? "No improvements selected"
                : `${formatNumber(
                    selected.length
                  )} improvement${
                    selected.length > 1
                      ? "s"
                      : ""
                  } selected`}
            </h2>
          </div>

          <div className="summary-stats">
            <div>
              <span>Upfront cost</span>

              <strong>
                {formatMoney(
                  results.cost
                )}
              </strong>
            </div>

            <div>
              <span>Annual savings</span>

              <strong>
                {formatMoney(
                  results.annualSavings
                )}
                <small>/ yr</small>
              </strong>
            </div>

            <div>
              <span>CO₂ reduction</span>

              <strong>
                {formatTons(
                  results.co2Reduction
                )}
                <small>/ yr</small>
              </strong>
            </div>

            <div>
              <span>Payback period</span>

              <strong>
                {results.payback
                  ? `${results.payback.toFixed(
                      1
                    )} yrs`
                  : "—"}
              </strong>
            </div>
          </div>
        </section>

        {selected.length > 0 && (
          <div className="co2-context">
            <strong>
              {formatTons(
                results.co2Reduction
              )}
            </strong>

            <span>
              annual CO₂ reduction ≈{" "}
              {vehicleEquivalent.toFixed(1)}{" "}
              passenger vehicles' annual
              emissions
            </span>
          </div>
        )}

        <section className="measures">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                YOUR OPTIONS
              </span>

              <h2>
                Choose what you would actually do
              </h2>

              <p>
                You can choose multiple options,
                as long as you stay within your
                budget.
              </p>
            </div>

            <span className="choice-count">
              {formatNumber(
                selected.length
              )}{" "}
              selected
            </span>
          </div>

          <div className="measure-grid">
            {measures.map((measure) => (
              <MeasureCard
                key={measure.id}
                measure={measure}
                selected={selected.includes(
                  measure.id
                )}
                incentivesEnabled={
                  incentivesEnabled
                }
                disabled={submitted}
                onToggle={() =>
                  toggle(measure.id)
                }
              />
            ))}
          </div>
        </section>

        <section className="submit-section">
          {results.remainingBudget < 0 && (
            <p className="warning">
              You are $
              {formatNumber(
                Math.abs(
                  results.remainingBudget
                )
              )}{" "}
              over budget. Remove an option
              before submitting.
            </p>
          )}

          {!submitted ? (
            <button
              className="primary-button"
              onClick={submit}
              disabled={
                results.remainingBudget < 0
              }
            >
              Submit my choices
            </button>
          ) : (
            <div className="submitted">
              <span>✓</span>
              Your choices are locked for
              Round {round}.
            </div>
          )}
        </section>

        {submitted && (
          <ClassResults
            aggregate={aggregate}
            measureNames={measureNames}
            round={round}
          />
        )}

        {submitted && round === 1 && (
          <section className="next-round">
            <div>
              <span className="eyebrow">
                ROUND 2
              </span>

              <h2>
                What if higher-cost options
                became more affordable?
              </h2>

              <p>
                Government incentives are now
                introduced for selected higher-cost
                options. Make your decision again.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={startRoundTwo}
            >
              Start Round 2
            </button>
          </section>
        )}

        {submitted && round === 2 && (
          <>
            <section className="next-round">
              <div>
                <span className="eyebrow">
                  FINAL DISCUSSION
                </span>

                <h2>
                  Did incentives change your
                  decision?
                </h2>

                <p>
                  Did lower upfront costs make you
                  more willing to choose a
                  higher-cost decarbonization
                  option?
                </p>
              </div>
            </section>

            <section className="willingness-section">
              <span className="eyebrow">
                FINAL QUESTION
              </span>

              <h2>
                Would you pay more?
              </h2>

              <p>
                Would you be willing to pay more
                upfront for a more eco-friendly
                product?
              </p>

              <div className="willingness-options">
                <button>
                  <strong>YES</strong>
                  <span>
                    I would pay more for the
                    environmental benefit.
                  </span>
                </button>

                <button>
                  <strong>
                    IT DEPENDS
                  </strong>
                  <span>
                    I would pay more if the savings
                    or payback were reasonable.
                  </span>
                </button>

                <button>
                  <strong>NO</strong>
                  <span>
                    I would prioritize lower
                    upfront cost.
                  </span>
                </button>
              </div>
            </section>
          </>
        )}

        <footer>
          <p>
            Classroom estimates are simplified
            for educational use. Actual costs,
            savings, and emissions reductions vary
            by home, climate, utility rates,
            equipment, and behavior.
          </p>
        </footer>
      </div>
    </main>
  )
}