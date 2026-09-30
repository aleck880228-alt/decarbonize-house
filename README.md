# Decarbonize Your House update

This is a clean front-end refactor for the classroom game.

## Current design
- $25,000 starting budget
- 6 household options
- Cost + annual savings + annual CO₂ reduction shown for every option
- Round 1: no incentives
- Round 2: simplified classroom incentives
- Anonymous aggregate class-results UI
- No student names, IDs, emails, or individual result display

## Important
`MOCK_RESULTS` in `app/page.tsx` is intentionally temporary. Replace it with Supabase aggregate data when the database is connected.

The incentive values are classroom assumptions, not a statement of current federal or state policy.

## Sources used for the assumptions
- ENERGY STAR air sealing and insulation methodology
- DOE heat-pump savings guidance
- ENERGY STAR heat-pump water-heater savings
- ENERGY STAR smart thermostat savings
- DOE 2025Q1 residential PV cost benchmark
- ENERGY STAR refrigerator efficiency information
- EPA greenhouse-gas equivalency methodology
