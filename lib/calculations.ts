import type { Measure } from "@/data/measures"

export type Results = {
  cost: number
  annualSavings: number
  co2Reduction: number
  remainingBudget: number
  payback: number | null
}

export const VEHICLE_CO2_PER_YEAR = 4.3

export function getEffectiveCost(
  measure: Measure,
  incentivesEnabled: boolean
) {
  return incentivesEnabled
    ? Math.max(0, measure.cost - measure.incentive)
    : measure.cost
}

export function calculateResults(
  selectedIds: string[],
  measures: Measure[],
  budget: number,
  incentivesEnabled: boolean
): Results {
  const selected = measures.filter((measure) =>
    selectedIds.includes(measure.id)
  )

  const cost = selected.reduce(
    (sum, measure) =>
      sum + getEffectiveCost(measure, incentivesEnabled),
    0
  )

  const annualSavings = selected.reduce(
    (sum, measure) => sum + measure.annualSavings,
    0
  )

  const co2Reduction = selected.reduce(
    (sum, measure) => sum + measure.co2Reduction,
    0
  )

  return {
    cost,
    annualSavings,
    co2Reduction,
    remainingBudget: budget - cost,
    payback:
      annualSavings > 0
        ? cost / annualSavings
        : null
  }
}

export function getVehicleEquivalent(
  co2Reduction: number
) {
  return co2Reduction / VEHICLE_CO2_PER_YEAR
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value)
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

export function formatTons(value: number) {
  return `${value.toFixed(1)} t`
}

export function formatYears(value: number | null) {
  return value !== null
    ? `${value.toFixed(1)} yrs`
    : "—"
}