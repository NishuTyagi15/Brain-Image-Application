import React, { useState } from 'react';
import { Typography, Checkbox, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { fetchDownloadUrl, fetchPreview } from '../../actions/Action';
import '../../styles/ChannelFiles.css';

const ChannelFiles = ({ channelName, files, selectedFiles, onFileSelect }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    // Function to split the file url into two parts
    const splitFileString = (file) => {
        const lastSlashIndex = file.lastIndexOf('/');
        const firstPart = file.substring(0, lastSlashIndex);
        const secondPart = file.substring(lastSlashIndex + 1);
        return { firstPart, secondPart };
    };

    // Function to handle single file download
    const handleDownload = async (file) => {
        const downloadUrl = await fetchDownloadUrl(file, false);
        const url = downloadUrl.url;
        const link = document.createElement('a');
        link.href = url;
        link.download = file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to handle file preview
    const handlePreview = async (file) => {
        const { firstPart, secondPart } = splitFileString(file);
        const previewUrl = `${firstPart}/downsampled/downsampled-${secondPart}`;
        const previewResponse = await fetchPreview(previewUrl);

        // Convert arraybuffer to Blob
        const blob = new Blob([previewResponse.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        // Set the image URL in state and open the dialog
        setPreviewImage(imageUrl);
        setOpenDialog(true);
    };

    // Function to handle the enlarge (open in new tab) action
    const handleEnlarge = () => {
        if (previewImage) {
            window.open(previewImage, '_blank', 'noopener,noreferrer');
        }
    };

    // Function to close the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setPreviewImage(null);
    };

    return (
        <div>
            <Typography>
                <strong>Channel:</strong> {channelName}
            </Typography>
            {files.map((file, index) => {
                const { secondPart } = splitFileString(file);

                return (
                    <div key={index} className='file-main'>
                        <div className='file-details'>
                            <Checkbox
                                checked={selectedFiles.includes(file)}
                                onChange={() => onFileSelect(file)}
                            />
                            <Typography>
                                <strong>File:</strong> {secondPart}
                            </Typography>
                        </div>
                        <div>
                            <Tooltip title="Download File">
                                <IconButton className='icon-button' onClick={() => handleDownload(file)}>
                                    <DownloadIcon className='download-icon' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Preview File">
                                <IconButton className='icon-button' onClick={() => handlePreview(file)}>
                                    <VisibilityIcon className='preview-icon' />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                );
            })}

            {/* Dialog for Image Preview */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg">
                <DialogTitle className='image-preview'>
                    Image Preview
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        style={{ position: 'absolute', right: 8, top: 8 }}
                        className='close-icon'
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {previewImage && (
                        <img src={previewImage} alt="Preview" style={{ width: '100%', maxHeight: '550px', objectFit: 'contain' }} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button className='cancel-button' onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button className='enlarge-button' onClick={handleEnlarge} color="primary">
                        Open In New Tab 
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ChannelFiles;
