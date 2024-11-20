import { useState } from 'react';

/**
 * Custom hook for handling table sorting in PrimeReact DataTable
 * @returns {object} - Provides sorting state and methods to update it
 */
export function useTableSort() {
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    /**
     * Handles sorting logic when a column is clicked
     * @param {string} field - Field to sort by
     */
    const handleSort = (field) => {
        if (sortField === field) {
            // Toggle between ascending, descending, and no sort
            setSortOrder((prevSortOrder) => (prevSortOrder === 1 ? -1 : prevSortOrder === -1 ? null : 1));
        } else {
            setSortField(field);
            setSortOrder(1); // Start with ascending order
        }
    };

    return {
        sortField,
        sortOrder,
        handleSort,
    };
}
