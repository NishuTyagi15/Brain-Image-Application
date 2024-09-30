import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChannelFiles from './ChannelFiles';

const SectionAccordion = ({ sectionNumber, keyIndex, channelData, onFileSelect, selectedFiles }) => {
    const allFiles = Object.keys(channelData).flatMap(channelName => channelData[channelName].files);

    const isSectionSelected = allFiles.every(file => selectedFiles.includes(file));

    const handleSectionSelect = (event) => {
        event.stopPropagation();
        if (isSectionSelected) {
            allFiles.forEach(file => onFileSelect(file));
        } else {
            allFiles.forEach(file => onFileSelect(file));
        }
    };

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className='file-details'>
                    <Checkbox
                        checked={isSectionSelected}
                        onClick={handleSectionSelect}
                    />
                    <Typography>
                        <strong>Section: {keyIndex + 1}</strong> {sectionNumber}
                    </Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    {Object.keys(channelData).map((channelName) => (
                        <ChannelFiles
                            key={channelName}
                            channelName={channelName}
                            files={channelData[channelName].files}
                            onFileSelect={onFileSelect}
                            selectedFiles={selectedFiles}
                        />
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default SectionAccordion;
