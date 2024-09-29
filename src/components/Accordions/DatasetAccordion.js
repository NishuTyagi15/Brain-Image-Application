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

const DatasetAccordion = ({ datasetName, sectionData, onFileSelect, selectedFiles }) => (
    <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Dataset:</strong> {datasetName}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box>
                {Object.keys(sectionData).map((sectionNumber, index) => (
                    <SectionAccordion
                        key={sectionNumber}
                        keyIndex={index}
                        sectionNumber={sectionNumber}
                        channelData={sectionData[sectionNumber].channels}
                        onFileSelect={onFileSelect}
                        selectedFiles={selectedFiles}
                    />
                ))}
            </Box>
        </AccordionDetails>
    </Accordion>
);

export default DatasetAccordion;
