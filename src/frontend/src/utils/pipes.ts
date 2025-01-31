/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { WbsNumber, User, wbsPipe, WbsElement } from 'shared';

/**
 * Pipes:
 *
 * Data transformation functions designed to abstract view-based adjustments.
 * Only string-based stuff basically.
 * Pipe is a term / tool from Angular.
 */

/** Display number as "4 weeks" or "1 week" */
export const weeksPipe = (weeks: number) => {
  return `${weeks} week${weeks === 1 ? '' : 's'}`;
};

/** Display number as "$535" */
export const dollarsPipe = (dollars: number) => {
  return `$${dollars}`;
};

/** Display WBS number as string "1.2.0" */
export { wbsPipe };

/** Display WBS number as string but always the project number (1.2.3 -> 1.2.0) */
export const projectWbsPipe = (wbsNum: WbsNumber) => {
  return wbsPipe({ ...wbsNum, workPackageNumber: 0 });
};

/** Display user by their name "Joe Shmoe" */
export const fullNamePipe = (user?: Pick<User, 'firstName' | 'lastName'>) => {
  return user ? `${user.firstName} ${user.lastName}` : emDashPipe('');
};

/** Display boolean as "YES" or "NO" */
export const booleanPipe = (bool: boolean) => {
  return bool ? 'YES' : 'NO';
};

/** Formats an array of objects into a string that is a list. */
export const listPipe = <T>(array: T[], transform: (ele: T) => string) => {
  return array.map(transform).join(', ');
};

/** Replaces an empty string with an EM dash. */
export const emDashPipe = (str: string) => {
  return str.trim() === '' ? '—' : str;
};

/**
 * Return a given date as a string in the local en-US format,
 * with single digit numbers starting with a zero.
 *
 * Prisma sends date in UTC but TypeScript assumes it's in your local time,
 * so to get around that we do the toDateString() of the time and pass it into the Date constructor
 * where the constructor assumes it's in UTC and makes the correct Date object finally
 */
export const datePipe = (date?: Date) => {
  if (!date) return '';
  date = new Date(date.toDateString());
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

/** returns a given number as a string with a percent sign */
export const percentPipe = (percent: number) => {
  return `${percent}%`;
};

export const numberParamPipe = (param: string | null) => {
  if (!param) return null;
  try {
    const num = parseInt(param);
    return num;
  } catch (err) {
    return null;
  }
};

/** Display timeline status in readable form
 *  E.G. VERY_BEHIND -> Very Behind
 */
export const timelinePipe = (status: string) => {
  return status
    .toLowerCase()
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
};

/**
 * Exports either 'X day(s)' or 'X week(s)' depending on how many days are given
 */
export const daysToDaysOrWeeksPipe = (days: number): string => {
  if (days < 7) return `${days} day${days === 1 ? '' : 's'}`;
  return `${weeksPipe(Math.floor(days / 7))}`;
};

export const daysOrWeeksLeftOrLate = (daysLeft: number) => {
  return `${daysToDaysOrWeeksPipe(Math.abs(daysLeft))} ${daysLeft > 0 ? 'left' : 'late'}`;
};

/** Display WBS number as string "1.2.0 - Project Name" */
export const wbsNamePipe = (wbsElement: WbsElement) => {
  return `${wbsPipe(wbsElement.wbsNum)} - ${wbsElement.name}`;
};

export const undefinedPipe = (element: any) => {
  return element != null ? element : '-----';
};
