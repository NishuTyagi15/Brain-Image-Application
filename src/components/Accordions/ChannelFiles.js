import React from 'react';
import { Typography } from '@mui/material';

const ChannelFiles = ({ channelName, files }) => (
    <div>
        <Typography>
            <strong>Channel:</strong> {channelName}
        </Typography>
        {files.map((file, index) => (
            <Typography key={index} className='file-details'>
                <strong>File:</strong> {file}
            </Typography>
        ))}
    </div>
);

export default ChannelFiles;
