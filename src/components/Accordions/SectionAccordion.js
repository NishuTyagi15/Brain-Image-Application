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
import ChannelFiles from './ChannelFiles';

const SectionAccordion = ({ sectionNumber, keyIndex, channelData, onFileSelect, selectedFiles, disableChildren }) => {
    const [disableChannels, setDisableChannels] = useState(false);

    const allFiles = Object.keys(channelData).flatMap(channelName => channelData[channelName].files);

    const isSectionSelected = allFiles.every(file => selectedFiles.includes(file));

    const handleSectionSelect = (event) => {
        event.stopPropagation();
        const isChecked = event.target.checked;

        allFiles.forEach(file => {
            onFileSelect(file, 'folder');
        });

        setDisableChannels(isChecked);
    };

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className='file-details'>
                    <Checkbox
                        checked={isSectionSelected}
                        onChange={handleSectionSelect}
                        onClick={(event) => event.stopPropagation()}
                        disabled={disableChildren}
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
                            disableChildren={disableChannels}
                        />
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default SectionAccordion;
