import axios from "axios";

// function to fetch the list of files, optionally using a continuation token for pagination
export const fetchFileList = async (prefix, continuationToken) => {
  try {
    const baseUrl = 'https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample/files';
    const params = {
      prefix
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

// funtion to generate a download URL for a file or a zip archive
export const fetchDownloadUrl = async(file, zipStatus) => {
  const response = await axios.get(`https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample/download/url?key=${file}&isZip=${zipStatus}`);
  return response.data.data;
}

// function to fetch a downsampled preview of an image
export const fetchPreview = async (previewUrl) => {
  const response = await axios.get(
    `https://47esi9z9a0.execute-api.us-east-1.amazonaws.com/downsample-dev/get-downsampled-image/${previewUrl}`, 
    { responseType: 'arraybuffer' }
  );
  return response;
};

//function to initiates a zip download process, based on either a folder or a list of files
export const fetchZipDownloadEtag = async ({ selectionType, folderPrefix, files, zipFileName }) => {
  const url = 'https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample/download';
  
  let bodyData;
  if (selectionType === 'folder') {
      bodyData = {
          folderPrefix,
          zipFileName,
      };
  } else {
      bodyData = {
          files,
          zipFileName,
      };
  }

  console.log("Request body:", bodyData);

  try {
      const response = await axios.post(url, bodyData);
      console.log("Response data:", response.data);
      return response.data;
  } catch (error) {
      console.error('Error fetching zip download etag:', error);
      throw error;
  }
};

// function to check the download progress of a zip creation request using a reference ID
export const fetchDownloadStatus = async (refId) => {
  const url = `https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample/download/progress/${refId}`;
  try {
    const response = await axios.get(url);
    console.log("nish response.data", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching download status:', error);
    throw error;
  }
};

//function to cancel an ongoing zip download process
export const cancelDownloading = async (refId, zipKey) => {
  const url = 'https://d7n70bd1mi.execute-api.us-east-1.amazonaws.com/sample/download/cancel';
  const bodyData = {
    refId, 
    zipKey
  };

  try {
    const response = await axios.delete(url, {
      data: bodyData,
    });

    console.log("nish response.data", response.data);
    return response.data;
  } catch (error) {
    console.error('Error canceling the download:', error);
    throw error;
  }
};

