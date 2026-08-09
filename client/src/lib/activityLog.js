const ACTIVITY_KEY = 'concerts_manager_activity_log';

export const recordActivity = ({ name = 'Guest', email = '', action, show = '' }) => {
  const current = JSON.parse(window.localStorage.getItem(ACTIVITY_KEY) || '[]');
  const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, email, action, show, occurredAt: new Date().toISOString() };
  window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify([entry, ...current].slice(0, 500)));
  return entry;
};

export const getActivityLog = () => JSON.parse(window.localStorage.getItem(ACTIVITY_KEY) || '[]');

export const downloadActivityCsv = () => {
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const rows = [['Date & time', 'Name', 'Email', 'Activity', 'Concert'], ...getActivityLog().map((item) => [new Date(item.occurredAt).toLocaleString(), item.name, item.email, item.action, item.show])];
  const url = URL.createObjectURL(new Blob([rows.map((row) => row.map(escape).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'concerts-manager-activity.csv';
  link.click();
  URL.revokeObjectURL(url);
};
