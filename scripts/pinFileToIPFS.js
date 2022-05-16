require('dotenv').config({path:__dirname+'/./../.env'})
const path = require('path');
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { storeDataToFile } = require("./ipfsHelper.js");
let ipfsImageHash;
let metahash;

// Calls Pinata API's to pin file to IPFS

const pinImageToIPFS = async (filePath,fileName) => {
  const pinataEndpoint = process.env.PINATA_ENDPOINT;
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataApiSecret = process.env.PINATA_API_SECRET;
  const form_data = new FormData();
  try {
    //need to build the complete path of the file from which the function can read the file
    form_data.append("file", fs.createReadStream(`${filePath}//${fileName}`));
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

   
    const response = await axios(request);
    // console.log("IpfsHash",response.data.IpfsHash);
    ipfsImageHash = response.data.IpfsHash;
    console.log('Successfully pinned IMAGE to IPFS : ', ipfsImageHash);
   // await storeDataToFile(response.data);
   } catch (err) {
    console.log('Error occurred while pinning file to IPFS: ', err);
  }
  metahash = {
    attributes: [
      {
        trait_type: "Color",
        value: "Purple",
      },
    ],
    description: "EYE Power!",
    image: "https://ipfs.io/ipfs/" + ipfsImageHash,

    name: "Eye Danger",
  };
  var jsonContent = JSON.stringify(metahash);
  let str = fileName;
  const Name =  str.slice(0, -4); // Masteringjs.io
 

 //CHANGED -- to write the file
  await fs.writeFile(path.join(__dirname, `../NftMetadata/${Name}.json`), jsonContent, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }else{
      console.log("JSON file has been saved to " +`NftMetadata/${Name}`);
      console.log("Now Uploading Metadata to the IPFS");
 
    }
  });
  const GetMetaData = path.join(__dirname, `../NftMetadata/${Name}.json`);
  const form_Meta_data = new FormData();
  try {
    form_Meta_data.append("file", fs.createReadStream(GetMetaData));
    const request = {
      method: "post",
      url: pinataEndpoint,
      maxContentLength: "Infinity",
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataApiSecret,
        "Content-Type": `multipart/form-data; boundary=${form_Meta_data._boundary}`,
      },
      data: form_Meta_data,
    };
   const response = await axios(request);
    MetaDataHash = response.data.IpfsHash;
    var obj = String(MetaDataHash);
    console.log("MetaDataIpfs_Hash", obj);

    await fs.writeFile(path.join(__dirname, `../NftMetadataHash/${Name}.json`), obj, "utf8", function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }else{
        console.log("MetaData Hash file has been saved to " +`NftMetadataHash/${Name}`);
       
      }
    });

  //  await storeDataToFile(response.data);
  //   console.log('Successfully added IPFS response to json file');
   } catch (err) {
     console.log('Error occurred while pinning file to IPFS: ', err);
   }

  
};


module.exports = {
  pinImageToIPFS
}
