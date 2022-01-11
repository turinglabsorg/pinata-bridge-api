const express = require("express");
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const pinataSDK = require('@pinata/sdk')
const fs = require('fs')

// Init Express App
const port = 3000;
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    fileUpload({
        limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
        useTempFiles: true
    })
);
app.use(express.json())

// Handle metadata upload
app.post('/upload', async (req, res) => {
    let file
    if (req.files === undefined || (req.files !== undefined && req.files.file === undefined)) {
        return res.status(500).json({
            error: 'No file data found.'
        });
    } else {
        file = req.files.file
    }
    if (req.body.name === undefined) {
        return res.status(500).json({
            error: 'No name specified.'
        });
    }
    // Parsing attributes field
    let attributes
    if (req.body.attributes !== undefined) {
        try {
            attributes = JSON.parse(req.body.attributes)
        } catch (e) {
            console.log("Can't parse attributes")
        }
    }

    try {
        const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);
        const fileCID = await pinata.pinFileToIPFS(fs.createReadStream(file.tempFilePath));
        const metadata = {
            "description": req.body.description,
            "external_url": req.body.external_url,
            "image": "ipfs://" + fileCID.IpfsHash,
            "attributes": attributes,
            "name": req.body.name
        }
        const metadataCID = await pinata.pinJSONToIPFS(metadata, { pinataMetadata: { name: '[BadgeME] ' + req.body.name } })
        return res.status(200).json({ metadata: metadata, ipfsHash: metadataCID.IpfsHash })
    } catch (e) {
        return res.status(500).json({ error: 'File upload failed, please retry.' });
    }
});

// Handle metadata request
app.get("/:ipfsHash", async function (req, res) {
    try {
        const metadata = await axios.get(process.env.IPFS_GATEWAY + req.params.ipfsHash)
        res.status(200).json(metadata.data);
    } catch (e) {
        res.status(500).json({
            error: "Something goes wrong, please retry."
        });
    }
});

app.listen(port, () => {
    console.log(`pinata-bridge-api listen at http://localhost:${port}`)
})