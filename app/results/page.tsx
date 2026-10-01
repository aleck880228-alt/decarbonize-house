"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { measures } from "@/data/measures"
import {
formatMoney,
formatPercent,
formatTons
} from "@/lib/calculations"
import { supabase } from "@/lib/supabase/client"

const HOUSEHOLD_ENERGY_CO2 = 7.45
const US_ANNUAL_GHG_CO2E = 6_197_300_000

type Submission = {
round: number
selected_measures: string[]
total_cost: number
annual_savings: number
total_co2: number
}

type RoundSummary = {
participants: number
totalCost: number
totalSavings: number
totalCO2: number
averageCost: number
averageSavings: number
averageCO2: number
}

export default function ResultsPage() {
const router = useRouter()

const [round, setRound] = useState<1 | 2>(1)
const [submissions, setSubmissions] = useState<Submission[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState("")

async function loadResults() {
const { data, error: fetchError } = await supabase
.from("submissions")
.select(
"round, selected_measures, total_cost, annual_savings, total_co2"
)

if (fetchError) {
  setError(fetchError.message)
  setLoading(false)
  return
}

setSubmissions((data ?? []) as Submission[])
setLoading(false)

}

useEffect(() => {
loadResults()


const interval = setInterval(() => {
  loadResults()
}, 2000)

return () => clearInterval(interval)

}, [])

const roundSubmissions = useMemo(() => {
return submissions.filter(
(submission) => submission.round === round
)
}, [submissions, round])

const summary = useMemo<RoundSummary>(() => {
const participants = roundSubmissions.length

const totalCost = roundSubmissions.reduce(
  (sum, item) => sum + Number(item.total_cost || 0),
  0
)

const totalSavings = roundSubmissions.reduce(
  (sum, item) => sum + Number(item.annual_savings || 0),
  0
)

const totalCO2 = roundSubmissions.reduce(
  (sum, item) => sum + Number(item.total_co2 || 0),
  0
)

return {
  participants,
  totalCost,
  totalSavings,
  totalCO2,
  averageCost:
    participants > 0
      ? totalCost / participants
      : 0,
  averageSavings:
    participants > 0
      ? totalSavings / participants
      : 0,
  averageCO2:
    participants > 0
      ? totalCO2 / participants
      : 0
}

}, [roundSubmissions])

const adoption = useMemo(() => {
const counts: Record<string, number> = {}

for (const submission of roundSubmissions) {
  for (const id of submission.selected_measures || []) {
    counts[id] = (counts[id] || 0) + 1
  }
}

return measures
  .map((measure) => {
    const count = counts[measure.id] || 0

    const percentage =
      summary.participants > 0
        ? (count / summary.participants) * 100
        : 0

    return {
      id: measure.id,
      name: measure.name,
      count,
      percentage
    }
  })
  .sort((a, b) => b.count - a.count)

}, [roundSubmissions, summary.participants])

const comparison = useMemo(() => {
const getRoundData = (targetRound: number) => {
const data = submissions.filter(
(submission) => submission.round === targetRound
)

const participants = data.length
const counts: Record<string, number> = {}

for (const submission of data) {
  for (const id of submission.selected_measures || []) {
    counts[id] = (counts[id] || 0) + 1
  }
}

return {
  participants,
  counts
}

}

const round1 = getRoundData(1)
const round2 = getRoundData(2)

return measures.map((measure) => {
const round1Count = round1.counts[measure.id] || 0
const round2Count = round2.counts[measure.id] || 0

const round1Percentage =
  round1.participants > 0
    ? (round1Count / round1.participants) * 100
    : 0

const round2Percentage =
  round2.participants > 0
    ? (round2Count / round2.participants) * 100
    : 0

return {
  id: measure.id,
  name: measure.name,
  round1Percentage,
  round2Percentage
}

})
}, [submissions])


const impact = useMemo(() => {
const householdEquivalent =
summary.totalCO2 / HOUSEHOLD_ENERGY_CO2

const usShare =
  (summary.totalCO2 / US_ANNUAL_GHG_CO2E) * 100

return {
  householdEquivalent,
  usShare
}

}, [summary.totalCO2])

return ( <main> <section className="hero results-hero"> <div className="container"> <div className="hero-content"> <p className="eyebrow">
EAS 574 · LIVE CLASS RESULTS </p>

        <h1>WHAT DID THE CLASS CHOOSE?</h1>

        <p className="hero-text">
          See how everyone's anonymous household
          decarbonization choices compare.
        </p>
      </div>
    </div>
  </section>

  <section className="game-section">
    <div className="container">

      <div className="results-tabs">
        <button
          className={round === 1 ? "active" : ""}
          onClick={() => setRound(1)}
        >
          Round 1
        </button>

        <button
          className={round === 2 ? "active" : ""}
          onClick={() => setRound(2)}
        >
          Round 2
        </button>
      </div>

      {error && (
        <div className="error-message">
          Something went wrong: {error}
        </div>
      )}

      {loading ? (
        <div className="results-header">
          <h2>Loading class results...</h2>
        </div>
      ) : (
        <>

          <div className="result-grid">

            <div className="result-card">
              <span>Participants</span>

              <strong>
                {summary.participants}
              </strong>

              <small>
                submitted plans
              </small>
            </div>

            <div className="result-card">
              <span>Total investment</span>

              <strong>
                {formatMoney(summary.totalCost)}
              </strong>

              <small>
                across all plans
              </small>
            </div>

            <div className="result-card">
              <span>Annual savings</span>

              <strong>
                {formatMoney(summary.totalSavings)}
              </strong>

              <small>
                across all plans
              </small>
            </div>

            <div className="result-card">
              <span>Annual CO₂ reduction</span>

              <strong>
                {formatTons(summary.totalCO2)}
              </strong>

              <small>
                across all plans
              </small>
            </div>

          </div>

          <div className="results-summary">

            <div>
              <span>Average investment</span>

              <strong>
                {formatMoney(summary.averageCost)}
              </strong>

              <small>
                per student
              </small>
            </div>

            <div>
              <span>Average annual savings</span>

              <strong>
                {formatMoney(summary.averageSavings)}
              </strong>

              <small>
                per student
              </small>
            </div>

            <div>
              <span>Average CO₂ reduction</span>

              <strong>
                {formatTons(summary.averageCO2)}
              </strong>

              <small>
                per student / year
              </small>
            </div>

          </div>

          <div className="popularity-section">

            <div className="measures-header">
              <div>
                <span className="section-label">
                  CLASS CHOICES
                </span>

                <h2>
                  Which measures were most popular?
                </h2>
              </div>
            </div>

            <div className="popularity-chart">

              {adoption.map((row) => (
                <div
                  className="adoption-row"
                  key={row.id}
                >

                  <div className="adoption-label">

                    <span>
                      {row.name}
                    </span>

                    <strong>
                      {formatPercent(row.percentage)}
                    </strong>

                  </div>

                  <div className="adoption-bar">
                    <div
                      className="adoption-bar-fill"
                      style={{
                        width: `${row.percentage}%`
                      }}
                    />
                  </div>

                  <small>
                    {row.count} of{" "}
                    {summary.participants} students
                  </small>

                </div>
              ))}

            </div>

          </div>

          <div className="impact-section">

            <div className="measures-header">
              <div>
                <span className="section-label">
                  CLASS CO₂ IMPACT
                </span>

                <h2>
                  How much difference did the class make?
                </h2>
              </div>
            </div>

            <div className="impact-main">

              <div className="impact-total">

                <span>
                  Total annual CO₂ reduction
                </span>

                <strong>
                  {formatTons(summary.totalCO2)}
                </strong>

                <small>
                  based on {summary.participants}{" "}
                  submitted plans
                </small>

              </div>

              <div className="impact-comparisons">

                <div className="impact-comparison">

                  <span>
                    Equivalent to approximately
                  </span>

                  <strong>
                    {impact.householdEquivalent.toFixed(1)}
                  </strong>

                  <p>
                    U.S. homes' annual energy-related
                    CO₂ emissions
                  </p>

                </div>

                <div className="impact-comparison">

                  <span>
                    Equivalent to approximately
                  </span>

                  <strong>
                    {impact.usShare < 0.0001
                      ? "<0.0001"
                      : impact.usShare.toFixed(4)}
                    %
                  </strong>

                  <p>
                    of 2025 U.S. gross greenhouse gas
                    emissions
                  </p>

                </div>

              </div>

            </div>

            <p className="impact-note">
              The household comparison uses an EPA estimate of 7.45 metric tons of CO₂ per U.S. household per year from home energy use. The U.S. comparison uses the 2025 estimated U.S. greenhouse gas emissions of 6.1 billion metric tons of CO₂e.
            </p>

          </div>

          <div className="change-section">

            <div className="measures-header">
              <div>
                <span className="section-label">
                  
                </span>

                <h2>
                  What changed when incentives were added?
                </h2>
              </div>
            </div>

<div className="comparison-chart">

  <div className="comparison-legend">
    <span>
      <i className="legend-round1" />
      Round 1
    </span>


<span>
  <i className="legend-round2" />
  Round 2
</span>


  </div>

  <div className="comparison-vertical-chart">


{comparison.map((row) => (
  <div
    className="comparison-group"
    key={row.id}
  >

    <div className="comparison-columns">

      <div className="comparison-column">
        <strong>
          {formatPercent(row.round1Percentage)}
        </strong>

        <div className="comparison-column-area">
          <div
            className="comparison-column-fill round1"
            style={{
              height: `${row.round1Percentage}%`
            }}
          />
        </div>

        <span>R1</span>
      </div>

      <div className="comparison-column">
        <strong>
          {formatPercent(row.round2Percentage)}
        </strong>

        <div className="comparison-column-area">
          <div
            className="comparison-column-fill round2"
            style={{
              height: `${row.round2Percentage}%`
            }}
          />
        </div>

        <span>R2</span>
      </div>

    </div>

    <div className="comparison-group-name">
      {row.name}
    </div>

  </div>
))}

  </div>

</div>
          </div>

        </>
      )}

      <div className="results-footer">

        <button
          className="secondary-button"
          onClick={() => router.push("/")}
        >
          Back to Activity
        </button>

      </div>

    </div>
  </section>
</main>

)
}
