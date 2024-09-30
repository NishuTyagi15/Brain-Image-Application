import { DATA_SET_SELECTED, FILE_LIST_DATA, SECTION_SELECTED, UPDATE_FILE_LIST_DATA } from "../utility/ActionConstants";

//function to add file list data
export const FileLists = (data) => ({
    type: FILE_LIST_DATA,
    payload: data,
});

//function tp update file list
export const updateFileList = (data) => ({
    type: UPDATE_FILE_LIST_DATA,
    payload: data
})

// function to set dataset checkbox selection status
export const datasetSelectionStatus = (status) => ({
    type: DATA_SET_SELECTED,
    payload: status
})

// function to set section checkbox selection status
export const sectionSelectStatus = (status) => ({
    type: SECTION_SELECTED,
    payload: status
})