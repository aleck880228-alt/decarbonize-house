export type Measure = {
  id: string
  name: string
  description: string
  cost: number
  annualSavings: number
  co2Reduction: number
  incentive: number
  category: "Low cost" | "Major upgrade" | "Long-term"
  sourceNote: string
}

export const BUDGET = 25000

export const measures: Measure[] = [
  {
    id: "thermostat",
    name: "Smart Thermostat",
    description:
      "Automatically adjust heating and cooling when you are asleep or away.",
    cost: 300,
    annualSavings: 50,
    co2Reduction: 0.2,
    incentive: 0,
    category: "Low cost",
    sourceNote:
      "Classroom estimate based on ENERGY STAR savings benchmarks."
  },
  {
    id: "refrigerator",
    name: "ENERGY STAR Refrigerator",
    description:
      "Replace an older refrigerator with a more efficient ENERGY STAR model.",
    cost: 1500,
    annualSavings: 80,
    co2Reduction: 0.15,
    incentive: 0,
    category: "Low cost",
    sourceNote:
      "Savings vary depending on the age and efficiency of the existing refrigerator."
  },
  {
    id: "insulation",
    name: "Air Sealing + Insulation",
    description:
      "Seal air leaks and improve insulation to reduce heating and cooling demand.",
    cost: 5000,
    annualSavings: 400,
    co2Reduction: 0.7,
    incentive: 1500,
    category: "Low cost",
    sourceNote:
      "Classroom estimate based on ENERGY STAR guidance for air sealing and insulation."
  },
  {
    id: "water-heater",
    name: "Heat Pump Water Heater",
    description:
      "Replace a conventional water heater with a high-efficiency heat pump water heater.",
    cost: 3500,
    annualSavings: 550,
    co2Reduction: 0.7,
    incentive: 1000,
    category: "Major upgrade",
    sourceNote:
      "Classroom estimate based on ENERGY STAR savings estimates for a typical household."
  },
  {
    id: "windows",
    name: "ENERGY STAR Windows",
    description:
      "Replace inefficient windows to improve comfort and reduce heating and cooling demand.",
    cost: 10000,
    annualSavings: 300,
    co2Reduction: 0.5,
    incentive: 2500,
    category: "Major upgrade",
    sourceNote:
      "Actual savings depend on the existing windows, climate, and home characteristics."
  },
  {
    id: "heat-pump",
    name: "Air-Source Heat Pump",
    description:
      "Replace your existing heating and cooling system with an efficient heat pump.",
    cost: 12000,
    annualSavings: 600,
    co2Reduction: 2.5,
    incentive: 4000,
    category: "Major upgrade",
    sourceNote:
      "Actual savings vary substantially by the existing heating system, climate, and electricity rates."
  },
  {
    id: "solar",
    name: "Rooftop Solar",
    description:
      "Install rooftop solar to generate electricity at home.",
    cost: 18000,
    annualSavings: 1300,
    co2Reduction: 2.8,
    incentive: 6000,
    category: "Long-term",
    sourceNote:
      "Classroom estimate. Actual cost and production depend on system size, location, and roof conditions."
  },
  {
    id: "solar-battery",
    name: "Solar + Battery",
    description:
      "Combine rooftop solar with battery storage for generation and flexibility.",
    cost: 25000,
    annualSavings: 1500,
    co2Reduction: 3.0,
    incentive: 7000,
    category: "Long-term",
    sourceNote:
      "Classroom estimate. Actual economics depend on system size, utility rates, and battery operation."
  }
]