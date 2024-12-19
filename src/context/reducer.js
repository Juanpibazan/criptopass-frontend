
export const actionTypes = {
    SET_ACTIVE_TITLE:'SET_ACTIVE_TITLE',
    SET_USER:'SET_USER',
    SET_JWT:'SET_JWT'
};

export const reducer = (state,action)=>{
    console.log(action);
    switch (action.type) {
        case actionTypes.SET_ACTIVE_TITLE:
            return {
                ...state,
                activeTitle: action.activeTitle
            }
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user
            }
        case actionTypes.SET_JWT:
            return {
                ...state,
                jwtoken: action.jwtoken
            }
        default:
            return state;
    }
};