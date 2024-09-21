// api.js
import axios from 'axios';
import Share from 'react-native-share';

import RNFetchBlob from 'rn-fetch-blob';

export const uploadImageWithOverlay = async (image, frame, action) => {
    try {

        const clearCache = async () => {
            try {
                const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
                const files = await RNFetchBlob.fs.ls(cacheDir);

                // Delete all files in the cache directory
                for (const file of files) {
                    await RNFetchBlob.fs.unlink(`${cacheDir}/${file}`);
                }

            } catch (error) {
            }
        };

        const apiUrl = 'https://imgoverlay.dohost.in/overlay';

        const formData = new FormData();
        formData.append('image1_url', image);
        formData.append('image2_url', frame);

        const response = await axios.post(apiUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const item = response.data.result_url;

        // Use RNFetchBlob to download and save the image
        const { config, fs } = RNFetchBlob;

        const getExtension = (filename) => {
            // To get the file extension
            return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
        };

        if (action == 'share') {
            return item;
        }

            let date = new Date();
            let ext = getExtension(item);
            ext = '.' + ext[0];

            let PictureDir = fs.dirs.DCIMDir;
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    // Related to Android only
                    useDownloadManager: true,
                    notification: true,
                    path:
                        PictureDir +
                        '/Branding Profitable/' +
                        Math.floor(date.getTime() + date.getSeconds() / 2) +
                        ext,
                    description: 'Image',
                },
            };

            const downloadResult = await config(options)
                .fetch('GET', item)
                .then((res) => {
                    console.log('Download success -> ', JSON.stringify(res));
                    return "Saved Successfully";
                })
                .catch((error) => {
                    console.log('Download failed -> ', error);
                    return "Download Failed";
                });

            return downloadResult;
       

    } catch (error) {
        console.log('Error in download image', error);
        throw error;
    }
};
