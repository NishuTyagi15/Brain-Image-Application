import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SectionAccordion from './SectionAccordion';

const DatasetAccordion = ({ datasetName, sectionData, onFileSelect, selectedFiles }) => {
    const [disableChildren, setDisableChildren] = useState(false);

    const allFilesInDataset = Object.keys(sectionData).flatMap(sectionNumber => {
        return Object.keys(sectionData[sectionNumber].channels).flatMap(channelName => {
            return sectionData[sectionNumber].channels[channelName].files;
        });
    });

    const isDatasetSelected = allFilesInDataset.every(file => selectedFiles.includes(file));

    const handleDatasetSelect = (event) => {
        event.stopPropagation();
        const isChecked = event.target.checked;

        allFilesInDataset.forEach(file => {
            onFileSelect(file, 'folder');
        });

        setDisableChildren(isChecked);
    };

    const handleCheckboxClick = (event) => {
        event.stopPropagation();
    };

    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className='file-details'>
                    <Checkbox
                        checked={isDatasetSelected}
                        onChange={handleDatasetSelect}
                        onClick={handleCheckboxClick}
                    />
                    <Typography><strong>Dataset:</strong> {datasetName}</Typography>
                </div>
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
                            disableChildren={disableChildren}
                        />
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default DatasetAccordion;
