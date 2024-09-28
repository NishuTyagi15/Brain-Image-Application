import { FILE_LIST_DATA, UPDATE_FILE_LIST_DATA } from "../utility/ActionConstants";

const initialState = {
    fileListData: [],
    
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILE_LIST_DATA:
            return {
                ...state,
                fileListData: action.payload
            };
        case UPDATE_FILE_LIST_DATA:
            return {
                ...state,
                fileListData: [...state.fileListData, ...action.payload]
            };
        default:
            return state;
    }
};

export default dataReducer;
