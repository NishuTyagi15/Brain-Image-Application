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



export const fetchDownloadUrl = async(file, zipStatus) => {
  const response = await axios.get(`https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample/download/url?key=${file}&isZip=${zipStatus}`);
  console.log("nish response.data", response.data)
  return response.data.data;
}

export const fetchPreview = async (previewUrl) => {
  const response = await axios.get(
    `https://47esi9z9a0.execute-api.us-east-1.amazonaws.com/downsample-dev/get-downsampled-image/${previewUrl}`, 
    { responseType: 'arraybuffer' }
  );
  return response;
};