import axios from "axios";

export const fetchFileList = async (continuationToken) => {
  try {
    const baseUrl = 'https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample/files';
    const params = {
      prefix: 'ACT-001/001-0-001/40019_SBIR_AD_Aim_4_1_WTM_40019_HETM_40029_103119/',
    };

    if (continuationToken) {
      params.pageToken = continuationToken;
    }

    const response = await axios.get(baseUrl, { params });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching file list:', error.response?.data || error.message);
    throw new Error('Failed to fetch file list');
  }
};



export const fetchJobDetails = async () => {
  const response = await axios.get('https://job-management-api.onrender.com/api/dashboard/summary');
  console.log("nish response.data", response.data)
  return response.data;
}

export const fetchJobPostingDetails = async () => {
  const response = await axios.get('https://job-management-api.onrender.com/api/jobs/postings');
  console.log("nish response.data11", response.data)
  return response.data;
}