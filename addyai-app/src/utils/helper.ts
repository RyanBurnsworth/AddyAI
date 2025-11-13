/**
 * Utility for checking synchronization status based on date comparison.
 * Note: Assumes LAST_SYNCED is defined elsewhere (e.g., in a shared constants file).
 */

import { LAST_SYNCED } from "./constants";

// Helper to strip time components (setting time to midnight in local timezone)
export const stripTime = (d: Date): Date => {
    // Creates a new Date object representing midnight (00:00:00) 
    // on the given day in the local timezone. This is the crucial fix for reliability.
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

/**
 * Checks if the last sync date is considered "up to date" relative to yesterday.
 * * "Up to date" means: The last synced date (day/month/year only) is 
 * yesterday's date or newer.
 * * @returns boolean True if the last sync date is >= yesterday (UP TO DATE).
 */
export const isOutOfSync = (): boolean => {
    // 1. Calculate Yesterday (Normalized)
    const today = new Date();
    const yesterday = stripTime(today);
    yesterday.setDate(today.getDate() - 1); // Yesterday at midnight

    // 2. Load Last Synced Date (new Date(string) accepts the flexible format)
    const lastSyncedDateString = localStorage.getItem(LAST_SYNCED);

    // 3. Prepare Target Date (Normalized)
    // If no sync date is found, we assume the target is yesterday (which results in "Up To Date")
    const rawTargetDate = lastSyncedDateString ? new Date(lastSyncedDateString) : yesterday;
    
    // Normalize targetDate to midnight for reliable day-level comparison
    const targetDate = stripTime(rawTargetDate);
    
    // 4. Perform Comparison
    // We compare the milliseconds (getTime()) of the normalized dates.
    return targetDate.getTime() >= yesterday.getTime();
};
