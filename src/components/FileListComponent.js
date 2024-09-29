import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchFileList } from '../actions/Action';
import { FileLists, updateFileList } from '../reduxStore/actions';
import '../styles/FileListComponent.css';
import ProjectAccordion from './Accordions/ProjectAccordion';
import { Download } from '@mui/icons-material';

const FileListComponent = ({ fileListData, FileLists, updateFileList }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]); // State to track selected files

    // Function to load more files using continuation token
    const loadMoreFiles = async (token) => {
        setFetchingMore(true);
        try {
            const newList = await fetchFileList(token);
            if (newList?.keys) {
                updateFileList(newList.keys);
            }
            if (newList?.nextContinuationToken) {
                loadMoreFiles(newList.nextContinuationToken);
            }
        } catch (error) {
            console.error('Error loading more files:', error);
        } finally {
            setFetchingMore(false);
        }
    };

    // Function to fetch the initial file list data
    const fetchFileListData = async () => {
        setLoading(true);
        try {
            const response = await fetchFileList();
            FileLists(response?.keys);
            if (response?.nextContinuationToken) {
                loadMoreFiles(response.nextContinuationToken);
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

    // Function to group files by project, dataset, section, and channel
    const groupFiles = (files) => {
        const projects = {};
        const regex = /(\d{3}-\d-\d{3})\/.*_(S\d{6})_(L\d{2})_(ch\d{2})\.tif/;

        files.forEach((file) => {
            const fetchSplittedData = file.match(regex);
            if (fetchSplittedData) {
                const [projectID, sectionNumber, datasetName, channelName] = fetchSplittedData.slice(1);

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

    // Function to handle file selection
    const handleFileSelection = (file) => {
        setSelectedFiles((prevSelectedFiles) =>
            prevSelectedFiles.includes(file)
                ? prevSelectedFiles.filter((f) => f !== file)
                : [...prevSelectedFiles, file]
        );
    };

    // Function to download selected files
    const downloadSelectedFiles = async () => {
        selectedFiles.forEach((file) => {
            // For each selected file, initiate the download
            const a = document.createElement('a');
            a.href = `YOUR_API_ENDPOINT_OR_S3_PATH/${file}`; // Adjust this to your API or file storage URL
            a.download = file;
            a.click();
        });
    };

    return (
        <div>
            <h2>File List</h2>
            <button className='download-button' onClick={downloadSelectedFiles} disabled={selectedFiles.length === 0}>
                <Download/> Download Selected Files
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
                        />
                    ))}
                    {fetchingMore && <p>Loading more files...</p>}
                </>
            )}
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
