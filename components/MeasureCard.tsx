"use client"

import type { Measure } from "@/data/measures"
import {
  formatMoney,
  formatYears,
  getEffectiveCost
} from "@/lib/calculations"

type Props = {
  measure: Measure
  selected: boolean
  incentivesEnabled: boolean
  disabled: boolean
  onToggle: () => void
}

export default function MeasureCard({
  measure,
  selected,
  incentivesEnabled,
  disabled,
  onToggle
}: Props) {
  const cost = getEffectiveCost(
    measure,
    incentivesEnabled
  )

  const payback =
    measure.annualSavings > 0
      ? cost / measure.annualSavings
      : null

  return (
    <button
      className={`measure-card ${
        selected ? "selected" : ""
      }`}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
    >
      <div className="measure-top">
        <div className="measure-title">
          <span className="category-label">
            {measure.category}
          </span>

          <h3>{measure.name}</h3>

          <p>{measure.description}</p>
        </div>

        <span
          className={`check ${
            selected ? "checked" : ""
          }`}
        >
          {selected ? "✓" : ""}
        </span>
      </div>

      <div className="measure-cost">
        <span>Upfront cost</span>

        <strong>{formatMoney(cost)}</strong>

        {incentivesEnabled &&
          measure.incentive > 0 && (
            <small className="incentive-text">
              Government incentive: -
              {formatMoney(measure.incentive)}
            </small>
          )}
      </div>

      <div className="measure-stats">
        <div>
          <span>Annual savings</span>
          <strong>
            {formatMoney(measure.annualSavings)}
            <small>/ yr</small>
          </strong>
        </div>

        <div>
          <span>CO₂ reduction</span>
          <strong>
            {measure.co2Reduction.toFixed(1)}
            <small> t / yr</small>
          </strong>
        </div>

        <div className="payback-stat">
          <span>Simple payback</span>
          <strong>
            {formatYears(payback)}
          </strong>
        </div>
      </div>
    </button>
  )
}