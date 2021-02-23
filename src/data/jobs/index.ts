import { scheduleJob } from 'node-schedule';
import { resetDatabases } from '..';

export const scheduleAllJobs = (): void => {
  // Reset builds db daily
  scheduleJob({ hour: 0, minute: 0 }, () => {
    console.log('[scheduled job] Resetting db table "builds".');
    resetDatabases(true, 'builds');
  });
};
