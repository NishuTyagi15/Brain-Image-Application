import React, { useState } from 'react';
import {
    Typography,
    Checkbox,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { fetchDownloadUrl, fetchPreview } from '../../actions/Action';
import '../../styles/ChannelFiles.css';
import { splitFileString } from '../../utility/utils';
import { OpenInNew } from '@mui/icons-material';
import { connect } from 'react-redux';

const ChannelFiles = ({ channelName, files, selectedFiles, onFileSelect, datasetSelected, sectionSelected }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

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

    const handlePreview = async (file) => {
        const { firstPart, secondPart } = splitFileString(file);
        const previewUrl = `${firstPart}/downsampled/downsampled-${secondPart}`;
        const previewResponse = await fetchPreview(previewUrl);
        const blob = new Blob([previewResponse.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        setPreviewImage(imageUrl);
        setOpenDialog(true);
    };

    const handleEnlarge = () => {
        if (previewImage) {
            window.open(previewImage, '_blank', 'noopener,noreferrer');
        }
    };

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
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onFileSelect(file);
                                }}
                                disabled={datasetSelected || sectionSelected}
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
            <Dialog className='preview-dialog' open={openDialog} onClose={handleCloseDialog} maxWidth="lg">
                <DialogTitle className='image-preview'>
                    Image Preview
                    <Tooltip title="Open In New Tab">
                        <IconButton
                            aria-label="close"
                            onClick={handleEnlarge}
                            style={{ position: 'absolute', right: 40, top: 8 }}
                            className='close-icon'
                        >
                            <OpenInNew />
                        </IconButton>
                    </Tooltip>
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
            </Dialog>
        </div>
    );
};

const mapStateToProps = (state) => ({
    datasetSelected: state.datasetSelected,
    sectionSelected: state.sectionSelected
});

export default connect(mapStateToProps, {})(ChannelFiles);
