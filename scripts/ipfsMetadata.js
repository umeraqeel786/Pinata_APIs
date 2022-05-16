require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { storeDataToFile } = require("./ipfsHelper.js");
let ipfsImageHash;
let metahash;

// Calls Pinata API's to pin file to IPFS
const pinFileToIPFS1 = async (filePath1) => {
  const pinataEndpoint = process.env.PINATA_ENDPOINT;
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataApiSecret = process.env.PINATA_API_SECRET;
  const form_data = new FormData();
  try {
    form_data.append("file", fs.createReadStream(filePath1));
    const request = {
      method: "post",
      url: pinataEndpoint,
      maxContentLength: "Infinity",
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataApiSecret,
        "Content-Type": `multipart/form-data; boundary=${form_data._boundary}`,
      },
      data: form_data,
    };

    //console.log('request:', request);

    const response = await axios(request);
    // console.log("IpfsHash",response.data.IpfsHash);
    ipfsImageHash = response.data.IpfsHash;
    console.log("HashIPFS", ipfsImageHash);
     console.log('Successfully pinned file to IPFS : ', response);
    await storeDataToFile(response.data);
    console.log('Successfully added IPFS response to json file');
  } catch (err) {
    console.log('Error occurred while pinning file to IPFS: ', err);
  }
};


module.exports = pinFileToIPFS1;