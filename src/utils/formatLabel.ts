/**
 * Formats a label based on the value, appending an 's' for plural cases
 *
 * @param {number} value - The value to determine the label's pluralization
 * @param {string} label - The label to be formatted (e.g., 'Day', 'Hour')
 * @returns {string} - The formatted label with correct pluralization
 *
 *  @example
 * // Returns 'Day'
 * formatLabel(1, 'Day')
 *
 * @example
 * // Returns 'Hours'
 * formatLabel(2, 'Hour')
 */
export function formatLabel(value: number, label: string): string {
  // Append 's' to the label if the value is not equal to 1 to make it plural
  return `${label}${value === 1 ? '' : 's'}`
}
