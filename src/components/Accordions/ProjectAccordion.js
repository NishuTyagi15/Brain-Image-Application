import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DatasetAccordion from './DatasetAccordion';

const ProjectAccordion = ({ projectID, datasetData, selectedFiles, handleFileSelection, onDatasetSelect }) => (
    <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Project:</strong> {projectID}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box>
                {Object.keys(datasetData).map((datasetName) => (
                    <DatasetAccordion
                        key={datasetName}
                        datasetName={datasetName}
                        sectionData={datasetData[datasetName].sections}
                        selectedFiles={selectedFiles}
                        onFileSelect={handleFileSelection}
                        onDatasetSelect={onDatasetSelect}
                    />
                ))}
            </Box>
        </AccordionDetails>
    </Accordion>
);

export default ProjectAccordion;
