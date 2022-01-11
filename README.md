# Pinata Express.js API

This is a simple bridge API that works with [Pinata](https://pinata.cloud) and [IPFS](https://ipfs.io).

You can use it to easily upload files and NFT metadata to Pinata or maybe to serve the metadata instead of using IPFS directly.

With one simple request you can upload image (or video, etc) on Pinata, create the metadata JSON and upload it as well on Pinata.

## Prepare the environment

You will need NodeJS and YARN. After you've installed all dependencies simply run:

```
yarn
```

Then, if you want to work with the hot reload:

```
yarn dev
```

Or, if you want to run it for production:

```
yarn start
```

## Use the bridge

Once the application is running you can use the endpoints:

### [POST] /upload

You must create a POST request inserting following fields as form-data:
- *file*: This field will contain the file itself
- *description*: This field will contain the description of the NFT
- *name*: This field will contain the name of the NFT
- *external_url*: This field will contain the external url
- *attributes*: This field can contain an array of attributes

To see metadata specification please refer to https://docs.opensea.io/docs/metadata-standards#metadata-structure.

An example of request, made with cURL is:

```
curl --location --request POST 'http://localhost:3000/upload' \
--form 'file=@"/home/turinglabs/Desktop/card ficos.png"' \
--form 'description="NFT DESCRIPTION"' \
--form 'external_url="NFT EXTERNAL URL"' \
--form 'name="NFT NAME"' \
--form 'attributes="[{\"trait_type\":\"trait_name_one\",\"value\":\"Trait_one\"},{\"trait_type\":\"Trait_name_two\",\"value\":\"Trait_two\"}]"'
```

Response will be something like:
```
{
    "metadata": {
        "description": "NFT DESCRIPTION",
        "external_url": "NFT EXTERNAL URL",
        "image": "ipfs://QmYPxKCJiQVESffLjztKUpdVWfcUuQUeHeXyYjaeE18Ppx",
        "attributes": [
            {
                "trait_type": "trait_name_one",
                "value": "Trait_one"
            },
            {
                "trait_type": "Trait_name_two",
                "value": "Trait_two"
            }
        ],
        "name": "NFT NAME"
    },
    "ipfsHash": "QmTZ25Zp4QR9L9QSb4x91u6EevwuMJyHYLVFSCHyh2SMNJ"
}
```

### [GET] /:ipfsHash

This GET request is a simple bridge between your enpoint and the end user, you can use it to change the metadata, hide them if you need or anything else.