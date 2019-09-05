const date = require('date-and-time');

const DAYS = 30;

const getCommitActivity = (commits) => {
  const offsets = new Array(DAYS).fill(null).map((el, idx) => idx - DAYS + 1);

  const byDaysOfWeek = [
    { day: 'Sunday', value: 0 },
    { day: 'Monday', value: 0 },
    { day: 'Tuesday', value: 0 },
    { day: 'Wednesday', value: 0 },
    { day: 'Thursday', value: 0 },
    { day: 'Friday', value: 0 },
    { day: 'Saturday', value: 0 }
  ];

  const roundToDay = value => new Date(value - (value % 86400000));

  if (!commits.length) {
    return {};
  }

  const now = roundToDay(new Date());

  const periods = offsets.map(offset => ({
    date: date.addDays(now, offset),
    value: 0
  }));

  commits.forEach((commit) => {
    const offset = DAYS - 1 - date.subtract(now, roundToDay(commit.createdAt)).toDays();
    periods[offset] = { ...periods[offset], value: periods[offset].value + 1 };

    const dayOfWeek = commit.createdAt.getDay();
    byDaysOfWeek[dayOfWeek] = { ...byDaysOfWeek[dayOfWeek], value: byDaysOfWeek[dayOfWeek].value + 1 };
  });

  const byPeriods = periods.map(period => ({
    ...period,
    date: date.format(period.date, 'MM/DD')
  }));

  return { byDaysOfWeek, byPeriods };
};

module.exports = {
  getCommitActivity
};
