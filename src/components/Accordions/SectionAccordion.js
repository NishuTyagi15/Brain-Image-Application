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

const SectionAccordion = ({ sectionNumber, channelData }) => (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Section</strong> {sectionNumber}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box>
                {Object.keys(channelData).map((channelName) => (
                    <ChannelFiles key={channelName} channelName={channelName} files={channelData[channelName].files} />
                ))}
            </Box>
        </AccordionDetails>
    </Accordion>
);

export default SectionAccordion;
