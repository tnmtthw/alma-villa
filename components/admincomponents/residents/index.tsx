// app/components/admincomponents/residents/index.ts

// Export all resident components for easy importing
export { default as ResidentsHeader } from './ResidentHeader'
export { default as ResidentsStats } from './ResidentsStats'
export { default as ResidentsFilters } from './ResidentFilters'
export { default as ResidentTableRow } from './ResidentTableRow'
export { default as ResidentsGrid } from './ResidentsGrid'

// Export modal components (named exports from ResidentModal)
export { AddResidentModal, MassImportModal } from './ResidentModal'

// Export types
export * from './types'