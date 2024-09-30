import { DATA_SET_SELECTED, FILE_LIST_DATA, SECTION_SELECTED, UPDATE_FILE_LIST_DATA } from "../utility/ActionConstants";

const initialState = {
    fileListData: [],
    datasetSelected: false,
    sectionSelected: false
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
                fileListData: action.payload
            };
        case DATA_SET_SELECTED:
            return {
                ...state,
                datasetSelected: action.payload
            };
        case SECTION_SELECTED:
            return {
                ...state,
                sectionSelected: action.payload
            };
        default:
            return state;
    }
};

export default dataReducer;
