import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChannelFiles from './ChannelFiles';

const SectionAccordion = ({ sectionNumber, keyIndex, channelData, onFileSelect, selectedFiles }) => (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Section: {keyIndex + 1}</strong> {sectionNumber}</Typography>
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

export default SectionAccordion;
