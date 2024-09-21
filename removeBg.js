import RNFetchBlob from "rn-fetch-blob";
import { View, Text } from 'react-native'
import React from 'react'
import axios from 'axios'

const removeBg = async (imagePath) => {

    try {

        const fs = RNFetchBlob.fs;

        const response = await axios.post("https://bgremove.dohost.in/remove-bg", {
            image_url: imagePath
        })

        const response1 = await RNFetchBlob.fetch('GET', response.data.image_url);

        // Get the image data as a base64 string
        const base64Data = response1.base64();

        const cdnUrl = "https://cdn.brandingprofitable.com/base64.php";

        const requestData = {
            base64_content: base64Data, // Use the updated base64 image data here
        };

        const res = await axios.post(cdnUrl,requestData);

        return "https://cdn.brandingprofitable.com/"+res.data.image_url

    } catch (error) {
        return error
    }
}

export default removeBg