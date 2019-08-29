const languageRepository = require('../../data/repositories/language.repository');

const getLanguageByName = langName => languageRepository.getByName(langName);

module.exports = { getLanguageByName };
