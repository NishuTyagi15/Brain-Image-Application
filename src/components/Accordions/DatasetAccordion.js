import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SectionAccordion from './SectionAccordion';

const DatasetAccordion = ({ datasetName, sectionData }) => (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>{datasetName}</strong></Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box>
                {Object.keys(sectionData).map((sectionNumber) => (
                    <SectionAccordion key={sectionNumber} sectionNumber={sectionNumber} channelData={sectionData[sectionNumber].channels} />
                ))}
            </Box>
        </AccordionDetails>
    </Accordion>
);

export default DatasetAccordion;
