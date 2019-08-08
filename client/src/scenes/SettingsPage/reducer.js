import { fetchUser } from '../../routines/routines';

const initialState = {
    data: {
        name: 'Vasyl Boyko',
        email: 'vboiko0@gmail.com',
        bio: 'Just a bit more about myself',
        url: 'https://depothub.xyz/vb-oiko',
        company: 'Binary Academy 2019',
        location: 'Kiyv',
        imgUrl: 'https://avatars3.githubusercontent.com/u/43011715?s=400&u=ad60df6df50e7d47ba97c26709508502feb4f342&v=4'
    },
    loading: false,
    error: null
};

export const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
    case fetchUser.TRIGGER:
        return {
            ...state,
            loading: true
        };
    case fetchUser.SUCCESS:
        return {
            ...state,
            data: action.payload
        };
    case fetchUser.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case fetchUser.FULFILL:
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};
