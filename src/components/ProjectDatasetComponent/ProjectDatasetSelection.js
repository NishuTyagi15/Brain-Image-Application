import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { fetchFileList } from '../../actions/Action';
import { connect } from 'react-redux';
import { fetchPrefixData } from '../../reduxStore/actions';
import './ProjectDatasetSelection.css';

const ProjectDatasetSelection = (props) => {
    const [projects, setProjects] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedDataset, setSelectedDataset] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetchFileList("ACT-001");
                const subFolders = response.subFolders;
                setProjects(subFolders);
                if (subFolders.length > 0) {
                    const firstProject = subFolders[0];
                    setSelectedProject(firstProject);
                    fetchDatasets(firstProject);
                }
            } catch (error) {
                console.error("Error fetching projects", error);
            }
        };

        fetchProjects();
    }, []);

    const fetchDatasets = async (project) => {
        try {
            const response = await fetchFileList(project);
            const subFolders = response.subFolders;
            setDatasets(subFolders);
            if (subFolders.length > 0) {
                const firstDataset = subFolders[0];
                setSelectedDataset(firstDataset);
                props.fetchPrefixData(firstDataset);
            }
        } catch (error) {
            console.error("Error fetching datasets", error);
        }
    };

    // funtion to handle Project Selection
    const handleProjectChange = (event) => {
        const project = event.target.value;
        setSelectedProject(project);
        fetchDatasets(project);
    };

    // function to handle Dataset Selection
    const handleDatasetChange = (event) => {
        const dataset = event.target.value;
        setSelectedDataset(dataset);
        props.fetchPrefixData(dataset);
    };

    return (
        <div>
            {/* Project Dropdown */}
            <FormControl fullWidth style={{ marginBottom: '20px', marginTop: '30px' }}>
                <InputLabel className='input-label'>Project</InputLabel>
                <Select
                    value={selectedProject}
                    onChange={handleProjectChange}
                >
                    {projects.map((project) => (
                        <MenuItem key={project} value={project}>
                            {project}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Dataset Dropdown */}
            <FormControl fullWidth style={{ marginTop: '20px' }}>
                <InputLabel className='input-label'>Dataset</InputLabel>
                <Select
                    value={selectedDataset}
                    onChange={handleDatasetChange}
                    disabled={datasets.length === 0}
                >
                    {datasets.map((dataset) => (
                        <MenuItem key={dataset} value={dataset}>
                            {dataset}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { fetchPrefixData })(ProjectDatasetSelection);
