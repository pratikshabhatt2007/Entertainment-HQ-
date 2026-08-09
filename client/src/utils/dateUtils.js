/**
 * Indian Standard Time (IST) Date & Time Formatting Utilities
 */

/**
 * Format a date string or timestamp into IST Date representation
 * Example: "Sat, 5 Sep 2026 IST" or "5 September 2026"
 */
export const formatISTDate = (dateStr, options = {}) => {
  if (!dateStr) return 'TBD';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options,
    });
  } catch (err) {
    return dateStr;
  }
};

/**
 * Format a time string into Indian Standard Time (IST) format
 * Example: "10:30 AM IST"
 */
export const formatISTTime = (timeStr) => {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  if (trimmed.toLowerCase().includes('ist')) return trimmed;
  return `${trimmed} IST`;
};

/**
 * Format full date and time into complete IST timestamp
 * Example: "5 Sep 2026 at 10:30 AM IST"
 */
export const formatISTDateTime = (dateStr, timeStr) => {
  const formattedDate = formatISTDate(dateStr);
  const formattedTime = timeStr ? formatISTTime(timeStr) : '';
  return formattedTime ? `${formattedDate} • ${formattedTime}` : `${formattedDate} IST`;
};
