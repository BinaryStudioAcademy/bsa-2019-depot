const langMap = require('language-map');

module.exports = {
  up: (queryInterface) => {
    const languages = Object.entries(langMap).map(([langName, { color }]) => ({
      name: langName,
      color: color || '#eeeeee'
    }));

    return queryInterface.bulkInsert('languages', languages);
  },
  down: queryInterface => queryInterface.bulkDelete('languages', null)
};
