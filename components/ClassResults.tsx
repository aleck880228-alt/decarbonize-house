import {
  formatMoney,
  formatPercent,
  formatTons,
  formatNumber
} from "@/lib/calculations"

export type Aggregate = {
  participants: number
  totalCost: number
  totalSavings: number
  totalCO2: number
  adoption: Record<string, number>
}

type Props = {
  aggregate: Aggregate
  measureNames: Record<string, string>
  round: 1 | 2
}

export default function ClassResults({
  aggregate,
  measureNames,
  round
}: Props) {
  const averageCO2 =
    aggregate.participants > 0
      ? aggregate.totalCO2 /
        aggregate.participants
      : 0

  const averageCost =
    aggregate.participants > 0
      ? aggregate.totalCost /
        aggregate.participants
      : 0

  const averageSavings =
    aggregate.participants > 0
      ? aggregate.totalSavings /
        aggregate.participants
      : 0

  const vehicleEquivalent =
    aggregate.totalCO2 / 4.3

  const adoptionRows = Object.entries(
    aggregate.adoption
  )
    .map(([id, count]) => ({
      id,
      name: measureNames[id] ?? id,
      count,
      percentage:
        aggregate.participants > 0
          ? (count /
              aggregate.participants) *
            100
          : 0
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <section className="results-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            ANONYMOUS CLASS RESULTS
          </span>

          <h2>
            {round === 1
              ? "What did the class choose?"
              : "How did the class respond to incentives?"}
          </h2>

          <p>
            Results are based on submitted household
            decisions.
          </p>
        </div>

        <span className="participant-pill">
          {formatNumber(
            aggregate.participants
          )}{" "}
          households
        </span>
      </div>

      <div className="result-grid">
        <div className="result-card">
          <span>Total investment</span>

          <strong>
            {formatMoney(
              aggregate.totalCost
            )}
          </strong>
        </div>

        <div className="result-card">
          <span>Annual savings</span>

          <strong>
            {formatMoney(
              aggregate.totalSavings
            )}
          </strong>
        </div>

        <div className="result-card">
          <span>Annual CO₂ reduction</span>

          <strong>
            {formatTons(
              aggregate.totalCO2
            )}
          </strong>
        </div>

        <div className="result-card">
          <span>CO₂ equivalent</span>

          <strong>
            {vehicleEquivalent.toFixed(1)}
          </strong>

          <small>
            passenger vehicles / yr
          </small>
        </div>
      </div>

      <div className="class-impact">
        <div>
          <span className="eyebrow">
            AVERAGE HOUSEHOLD
          </span>

          <h3>
            {formatMoney(averageCost)} invested
          </h3>

          <p>
            Each household saves about{" "}
            <strong>
              {formatMoney(averageSavings)}
            </strong>{" "}
            per year and reduces about{" "}
            <strong>
              {formatTons(averageCO2)}
            </strong>{" "}
            of CO₂ per year.
          </p>

          <p className="impact-note">
            For scale, 4.3 metric tons of CO₂ is
            approximately equivalent to the annual
            emissions from one typical passenger
            vehicle.
          </p>
        </div>
      </div>

      <div className="adoption-section">
        <div className="adoption-heading">
          <div>
            <span className="eyebrow">
              POPULARITY
            </span>

            <h3>
              Which improvements were most popular?
            </h3>
          </div>

          <span className="adoption-note">
            Share of households selecting each option
          </span>
        </div>

        <div className="adoption-chart">
          {adoptionRows.length === 0 ? (
            <p>
              Waiting for classroom submissions...
            </p>
          ) : (
            adoptionRows.map((row, index) => (
              <div
                className="adoption-row"
                key={row.id}
              >
                <div className="adoption-rank">
                  {index + 1}
                </div>

                <div className="adoption-name">
                  <span>{row.name}</span>
                </div>

                <div className="adoption-bar">
                  <div
                    className="adoption-bar-fill"
                    style={{
                      width: `${row.percentage}%`
                    }}
                  />
                </div>

                <strong>
                  {formatPercent(
                    row.percentage
                  )}
                </strong>
              </div>
            ))
          )}
        </div>
      </div>

      {round === 1 && (
        <section className="discussion-card">
          <span className="eyebrow">
            DISCUSSION
          </span>

          <h3>
            What influenced your decision?
          </h3>

          <div className="discussion-points">
            <span>Upfront cost</span>
            <span>Annual savings</span>
            <span>Payback period</span>
            <span>CO₂ reduction</span>
          </div>

          <p>
            Which of these factors mattered most
            when deciding what you would actually
            purchase?
          </p>
        </section>
      )}

      {round === 2 && (
        <section className="discussion-card">
          <span className="eyebrow">
            DISCUSSION
          </span>

          <h3>
            Did incentives change your decision?
          </h3>

          <p>
            Compare Round 1 and Round 2. Did lower
            upfront costs make you more willing to
            choose a higher-cost decarbonization
            option?
          </p>
        </section>
      )}
    </section>
  )
}