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
import SectionAccordion from './SectionAccordion';
import { connect } from 'react-redux';
import { datasetSelectionStatus } from '../../reduxStore/actions';

const DatasetAccordion = ({ datasetName, sectionData, onFileSelect, selectedFiles, datasetSelectionStatus, sectionSelected }) => {

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

        datasetSelectionStatus(isChecked);
    };

    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className='file-details'>
                    <Checkbox
                        checked={isDatasetSelected}
                        onChange={handleDatasetSelect}
                        onClick={(event) => event.stopPropagation()}
                        disabled={sectionSelected}
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
                        />
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

const mapStateToProps = (state) => ({
    sectionSelected: state.sectionSelected
});

export default connect(mapStateToProps, { datasetSelectionStatus })(DatasetAccordion);
