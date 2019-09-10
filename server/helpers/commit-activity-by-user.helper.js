const date = require('date-and-time');

const getActivityDatesObject = (createdRepoDate) => {
  const byWeeks = [];
  let firstTimeLimit = createdRepoDate;
  const secondTimeLimit = Date.now();
  while (firstTimeLimit < secondTimeLimit) {
    byWeeks.push({
      date: new Date(firstTimeLimit),
      value: 0
    });
    firstTimeLimit = date.addDays(firstTimeLimit, 7);
  }
  byWeeks.push({
    date: new Date(secondTimeLimit),
    value: 0
  });

  return byWeeks;
};

const getActivityByUser = (commits, createdRepoDate) => {
  const byWeeks = getActivityDatesObject(createdRepoDate);
  commits.forEach(({ createdAt: commitTime }) => {
    byWeeks.forEach((datePoint, idx) => {
      if (
        byWeeks[idx + 1]
        && new Date(commitTime) > new Date(byWeeks[idx].date)
        && new Date(commitTime) < new Date(byWeeks[idx + 1].date)
      ) {
        byWeeks[idx + 1].value += 1;
      }
    });
  });

  return byWeeks;
};

module.exports = {
  getActivityByUser
};
