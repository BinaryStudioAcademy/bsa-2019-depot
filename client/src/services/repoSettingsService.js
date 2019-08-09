let settings = {
    name: '123',
    owner: '',
    isPublic: true
};

export const getSettings = ({ owner, name }) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(settings);
        }, 500);
    });
};

export const renameRepo = ({ owner, name, oldName }) => {
    return new Promise(resolve => {
        settings.name = name;
        setTimeout(() => {
            resolve(settings);
        }, 500);
    });
};

export const changePrivacy = payload => {
    return new Promise(resolve => {
        settings.isPublic = payload.isPublic;
        setTimeout(() => {
            resolve(settings);
        }, 500);
    });
};
