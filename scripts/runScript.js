const path = require('path');
const {pinImageToIPFS,pinMetaDataToIPFS} = require('./pinFileToIPFS');
const ImagePath = path.join(__dirname, '../assets');
const fs = require('fs');

const PinToPinata = async()=>{


 const  files = fs.readdirSync(ImagePath);

  for (const file of files) {
    console.log("Uploading Image IPFS Pinata")
    //need to send the path and the file in order to process the file
    await pinImageToIPFS(ImagePath,file);

  }
}
PinToPinata();