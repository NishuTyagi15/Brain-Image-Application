import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { cancelDownloading, fetchDownloadStatus, fetchDownloadUrl, fetchFileList, fetchZipDownloadEtag } from '../../actions/Action';
import { FileLists, updateFileList } from '../../reduxStore/actions';
import '../../styles/FileListComponent.css';
import ProjectAccordion from '../Accordions/ProjectAccordion';
import { Download, Cancel } from '@mui/icons-material';
import { LinearProgress, Button, CircularProgress, Typography, Snackbar, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, Alert } from '@mui/material';
import { splitFileString } from '../../utility/utils';

const FileListComponent = ({ fileListData, FileLists, updateFileList }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectionType, setSelectionType] = useState('');
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloading, setDownloading] = useState(false);
    const [continuationToken, setContinuationToken] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [refId, setRefId] = useState(null);
    const [zipKey, setZipKey] = useState(null);
    const [isCanceled, setIsCanceled] = useState(false);    

    let pollingInterval;

    // function to load more files using continuation token
    const loadMoreFiles = async () => {
        setSelectedFiles([]);
        if (!continuationToken) return;

        setFetchingMore(true);
        try {
            const newList = await fetchFileList(continuationToken);
            if (newList?.keys) {
                updateFileList(newList.keys);
            }
            if (newList?.nextContinuationToken) {
                setContinuationToken(newList.nextContinuationToken);
            } else {
                setContinuationToken(null);
            }
        } catch (error) {
            console.error('Error loading more files:', error);
        } finally {
            setFetchingMore(false);
        }
    };

    // function to fetch the initial file list data
    const fetchFileListData = async () => {
        setLoading(true);
        try {
            const response = await fetchFileList();
            FileLists(response?.keys);
            if (response?.nextContinuationToken) {
                setContinuationToken(response.nextContinuationToken);
            }
        } catch (error) {
            console.error('Error fetching file list:', error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect to fetch file list data when the component mounts
    useEffect(() => {
        fetchFileListData();
    }, []);

    // function to group files by project, dataset, section, and channel
    const groupFiles = (files) => {
        const projects = {};
        const regex = /(\d{3}-\d-\d{3})\/([^\/]+)\/.*_(S\d{6})_(L\d{2})_(ch\d{2})\.tif/;
    
        files.forEach((file) => {
            const fetchSplittedData = file.match(regex);
            if (fetchSplittedData) {
                const [projectID, datasetName, sectionNumber, layer, channelName] = fetchSplittedData.slice(1);
    
                // Initializing project structure if it doesn't exist
                if (!projects[projectID]) {
                    projects[projectID] = { datasets: {} };
                }
                // Create dataset structure if it doesn't exist
                if (!projects[projectID].datasets[datasetName]) {
                    projects[projectID].datasets[datasetName] = { sections: {} };
                }
                // Create section structure if it doesn't exist
                if (!projects[projectID].datasets[datasetName].sections[sectionNumber]) {
                    projects[projectID].datasets[datasetName].sections[sectionNumber] = { channels: {} };
                }
                // Initializing the channel structure if it doesn't exist
                if (!projects[projectID].datasets[datasetName].sections[sectionNumber].channels[channelName]) {
                    projects[projectID].datasets[datasetName].sections[sectionNumber].channels[channelName] = { files: [] };
                }
                // Pushing the file into the channel's files array
                projects[projectID].datasets[datasetName].sections[sectionNumber].channels[channelName].files.push(file);
            }
        });
    
        return projects;
    };

    const fileGroups = groupFiles(fileListData || {});

    // function to handle file selection
    const handleFileSelection = (file, type = '') => {
        console.log("nish type", type)
        setSelectionType(type)
        setSelectedFiles((prevSelectedFiles) =>
            prevSelectedFiles.includes(file)
                ? prevSelectedFiles.filter((f) => f !== file)
                : [...prevSelectedFiles, file]
        );
    };

    // function to download selected files
    const downloadSelectedFiles = async () => {
        setDownloading(true);
        setDownloadProgress(0);
        setDialogOpen(true);
    
        let selectedFilesData = null;
        let folderPrefix = null;
        let zipFileName = `Sample-${Math.random().toString().slice(2, 6)}.zip`;
    
        // Step 1: Process based on selection type
        if (selectionType === 'folder') {
            selectedFilesData = splitFileString(selectedFiles[0]);
            folderPrefix = selectedFilesData.firstPart;
        } else {
            selectedFilesData = selectedFiles;
        }
    
        try {
            // Step 2: Call API to get etags for selected files or folders
            const zipConversionResponse = await fetchZipDownloadEtag({
                selectionType,
                folderPrefix,
                files: selectedFilesData,
                zipFileName,
            });
        
            // Step 3: If a direct download URL is provided in the response, download the file immediately
            if (zipConversionResponse?.url) {
                const downloadLink = document.createElement('a');
                downloadLink.href = zipConversionResponse.url;
                downloadLink.download = zipFileName;
                downloadLink.click();
    
                setSnackbarMessage('Download started');
                handleSuccess();
            } else {
                // Step 4: Polling for the zip conversion status if no direct URL is available
                setRefId(zipConversionResponse.ref);
                pollingInterval = setInterval(async () => {
                    if (isCanceled) {
                        clearInterval(pollingInterval);
                        return;
                    }
                    try {
                        const statusResponse = await fetchDownloadStatus(zipConversionResponse.ref);
    
                        const { uploadProgress, status, key } = statusResponse;
                        setDownloadProgress(uploadProgress);
                        setZipKey(key);
    
                        if (status.toLowerCase() === 'completed') {
                            handleSuccess();
                            setSnackbarMessage('Downloading started');
                            
                            // Step 5: Download the zip file
                            const downloadLink = document.createElement('a');
                            const downloadUrl = await fetchDownloadUrl(key, true);
                            downloadLink.href = downloadUrl.url;
                            downloadLink.download = downloadUrl.key;
                            downloadLink.click();
                        } else if (status.toLowerCase() === 'not_found' || status.toLowerCase() === 'no_such_upload') {
                            handleCancel();
                            setSnackbarMessage('Downloading Failed');
                        }
                    } catch (pollingError) {
                        handleCancel();
                        setSnackbarMessage('Downloading Failed');
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Error during download:', error);
            setSnackbarMessage('Downloading Failed');
            handleCancel();
        }
        setSelectedFiles([]);
    };    

    const handleCancel = () => {
        clearInterval(pollingInterval);
        setDownloading(false);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setDialogOpen(false);
    }

    const handleSuccess = () => {
        clearInterval(pollingInterval);
        setDownloading(false);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setDialogOpen(false);
    }

    // Cancel the download by calling the cancel API
    const handleCancelDownload = async () => {
        try {
            setIsCanceled(true);
            await cancelDownloading(refId, zipKey);
            handleSuccess();
            setSnackbarMessage('Downloading Canceled');
            return false;
        } catch (error) {
            console.error('Error canceling download:', error);
            setSnackbarMessage('Cancelling download Failed');
            handleCancel();
        }
    };

    // Snackbar close handler
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleDialogClose = (event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleCancelDownload();
        }
    };

    return (
        <div>
            <h2>Folder Structure</h2>
            <button
                className='download-button'
                onClick={downloadSelectedFiles}
                disabled={selectedFiles.length === 0 || downloading}
            >
                <Download/> Convert to Zip And Download Selected Files
            </button>
            {loading ? (
                <p>Loading initial file list...</p>
            ) : (
                <>
                    {Object.keys(fileGroups).map((projectID) => (
                        <ProjectAccordion
                            key={projectID}
                            projectID={projectID}
                            datasetData={fileGroups[projectID].datasets}
                            selectedFiles={selectedFiles}
                            handleFileSelection={handleFileSelection}
                            onDatasetSelect={handleFileSelection}
                        />
                    ))}
                    {fetchingMore && <p>Loading more files...</p>}
                    {/* Pagination Button */}
                    {continuationToken && !fetchingMore && (
                        <button
                            className='download-button'
                            onClick={loadMoreFiles}
                            disabled={fetchingMore}
                            style={{ marginTop: '20px' }}
                            endIcon={fetchingMore ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {fetchingMore ? 'Loading...' : 'Load More Files'}
                        </button>
                    )}
                </>
            )}

            {/* Download Progress Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Download Progress
                    <Tooltip title="Cancel download">
                        <IconButton onClick={handleCancelDownload} style={{ float: 'right' }}>
                            <Cancel />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Progress: {downloadProgress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={downloadProgress} />
                </DialogContent>
            </Dialog>

            {/* Snackbar for download status */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

const mapStateToProps = (state) => ({
    fileListData: state.fileListData,
});

const mapActionToProps = {
    FileLists,
    updateFileList,
};

export default connect(mapStateToProps, mapActionToProps)(FileListComponent);
