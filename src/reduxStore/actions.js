import { FILE_LIST_DATA, UPDATE_FILE_LIST_DATA } from "../utility/ActionConstants";

//function to add file list data
export const FileLists = (data) => ({
    type: FILE_LIST_DATA,
    payload: data,
});

export const updateFileList = (data) => ({
    type: UPDATE_FILE_LIST_DATA,
    payload: data
})