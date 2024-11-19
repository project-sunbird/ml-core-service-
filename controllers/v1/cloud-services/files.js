/**
 * name : files.js
 * author : Rakesh
 * created-date : 12-Mar-2021
 * Description :  Files Controller.
 */


// dependencies
let filesHelpers = require(ROOT_PATH+"/module/cloud-services/files/helper");
const path = require("path");
const fs = require("fs");
const moment = require("moment-timezone");
/**
    * Files service.
    * @class
*/

module.exports = class Files {

    /**
     * @apiDefine errorBody
     * @apiError {String} status 4XX,5XX
     * @apiError {String} message Error
     */

    /**
     * @apiDefine successBody
     * @apiSuccess {String} status 200
     * @apiSuccess {String} result Data
     */

    constructor() { }

    static get name() {
        return "files";
    }


    /**
     * @api {post} /kendra/api/v1/cloud-services/files/preSignedUrls  
     * Get signed URL.
     * @apiVersion 1.0.0
     * @apiGroup Files
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParamExample {json} Request:
     * {
     *  "request" : {
     *  "5f72f9998925ec7c60f79a91": {
     *     "files": ["uploadFile.jpg", "uploadFile2.jpg"]
        }},
        "ref" : "survey"
      }
     * @apiSampleRequest /kendra/api/v1/cloud-services/files/preSignedUrls
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
     * * {
        "message": "File upload urls generated successfully.",
        "status": 200,
        "result": {
            "5f72f9998925ec7c60f79a91": {
                "files": [
                    {
                        "file": "uploadFile.jpg",
                        "url": "https://storage.googleapis.com/sl-dev-storage/01c04166-a65e-4e92-a87b-a9e4194e771d/5f72f9998925ec7c60f79a91/cd6763c9-a64a-4241-9907-4365970e8d11_uploadFile.jpg?GoogleAccessId=sl-dev-storage%40shikshalokam.iam.gserviceaccount.com&Expires=1605698490&Signature=ej6WHNOyx6EvUbAi81pDcYb3YqM7dkAhNT1Ktsf%2FTiRhwL%2ByhS89E1zRspIYlVOutlzoZXgRAl%2Fd0y%2BQcdryWYgfVAKAZmJVZtK3oVisLxhkFCKYeHAbzZ%2FadkCXdU3e1AVJGyRvKoN04Yr84%2BIa%2F1ApszOYDmVT%2Fn%2FOi4JSScbvzhe82bSe5xEr%2FPDwDq48%2FKgUhAc0faP%2FlAA2Wf7V1Ifuxc3quw9OpzvND8CKuugXZ%2FDZ6mhF0O80IXwP%2BFJOn4u9ydHqwXM3zDRDOO0WMh6VBLuvRFBRwJsrJG3v5zZMw0r5cYOIvkW4Tqo%2FefpXUDsvCVBTlZ9zBEdwx2Jshw%3D%3D",
                        "payload": {
                            "sourcePath": "01c04166-a65e-4e92-a87b-a9e4194e771d/5f72f9998925ec7c60f79a91/cd6763c9-a64a-4241-9907-4365970e8d11_uploadFile.jpg"
                        }
                    },
                    {
                        "file": "uploadFile2.jpg",
                        "url": "https://storage.googleapis.com/sl-dev-storage/01c04166-a65e-4e92-a87b-a9e4194e771d/5f72f9998925ec7c60f79a91/1626ec00-f890-4f8b-9594-4342868e8703_uploadFile2.jpg?GoogleAccessId=sl-dev-storage%40shikshalokam.iam.gserviceaccount.com&Expires=1605698490&Signature=RucBanx70czWdcqNb5R3wTtATUCGl7BH6vUbx6GJqJJnxvVF179XLCgPHUcsv9eXNv9o0ptueFwA%2BHTAOA4d7g6tx2G7BYqua1zMsGIw5%2B57dUaIRfgXQgO%2Br5voQvKMDmSUJMx9nVY0Dfe5xce3xbcn4XjtQKopb%2Fjh1YqnCmnK7EujbU2tfk0ENBKHtEyd%2FdZlpCtQ7IqnZ%2FZJ73OZgX%2FjnFd18iJ2ce7%2FJ%2FwjUBUQnTBLPk7n%2FMFDkLfNMeSYlutwkwcApLj9cuLO%2FbmuEfT%2Fa%2BxzJz1xF639piOpTW6vAFHgXJz%2FLtR9nMUidMTOnhZdhTjjr%2BFiokqK03SGNw%3D%3D",
                        "payload": {
                            "sourcePath": "01c04166-a65e-4e92-a87b-a9e4194e771d/5f72f9998925ec7c60f79a91/1626ec00-f890-4f8b-9594-4342868e8703_uploadFile2.jpg"
                        }
                    }
                ]
            }
        }
    }
     */

    /**
      * Get signed urls.
      * @method
      * @name preSignedUrls
      * @param  {Request}  req  request body.
      * @param  {Array}  req.body.fileNames - list of file names
      * @param  {String}  req.body.bucket - name of the bucket  
      * @returns {JSON} Response with status and message.
    */

    async preSignedUrls(req) {
        return new Promise(async (resolve, reject) => {
          try {
            let signedUrl = await filesHelpers.preSignedUrls(
              req.body.request,
              req.body.ref,
              req.userDetails ? req.userDetails.userId : "",
              req.query.serviceUpload == "true"? true : false
            );
            signedUrl["result"] = signedUrl["data"];
            return resolve(signedUrl);
          } catch (error) {
            return reject({
              status:
                error.status || httpStatusCode["internal_server_error"].status,
    
              message:
                error.message || httpStatusCode["internal_server_error"].message,
    
              errorObject: error,
            });
          }
        });
    }

    /**
     * @api {post} /kendra/api/v1/cloud-services/files/getDownloadableUrl  
     * Get downloadable URL.
     * @apiVersion 1.0.0
     * @apiGroup Gcp
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParam {String[]} [filePaths] An array of file paths, can be sent via query parameters or request body.
     * @apiParamExample {json} Request (Body):
     * {
     *     "filePaths": ["survey/5f72f9998925ec7c60f79a91//e7455f6c-468d-4fdf-9f6c-546d6b7d1370/uploadFile.jpg","survey/5f72f9998925ec7c60f79a91//e7455f6c-468d-4fdf-9f6c-546d6b7d1370/uploadFile2.jpg"]
     * }
     * @apiParamExample {json} Request (Query):
     * /kendra/api/v1/cloud-services/files/getDownloadableUrl?filePaths=survey/5f72f9998925ec7c60f79a91//e7455f6c-468d-4fdf-9f6c-546d6b7d1370/uploadFile.jpg,survey/5f72f9998925ec7c60f79a91//e7455f6c-468d-4fdf-9f6c-546d6b7d1370/uploadFile2.jpg
     * @apiSampleRequest /kendra/api/v1/cloud-services/files/getDownloadableUrl
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
     * {
     *      "message": "Url's generated successfully",
     *       "status": 200,
     *       "result": [
     *           {
     *               "cloudStorage": "oci",
     *               "filePath": "survey/5f72f9998925ec7c60f79a91//e7455f6c-468d-4fdf-9f6c-546d6b7d1370/uploadFile.jpg",
     *               "url": "https://ax2cel5zyviy.compat.objectstorage.ap-hyderabad-1.oraclecloud.com/samiksha/survey/5f72f9998925ec7c60f79a91//e7455f6c-468d-4fdf-9f6c-546d6b7d1370/uploadFile.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=3737771d26e1d8f211a04ec59cfd3037c8d1c6ff%2F20240802%2Fap-hyderabad-1%2Fs3%2Faws4_request&X-Amz-Date=20240802T051354Z&X-Amz-Expires=1800&X-Amz-Signature=4ed5c7327315bb8cba99f4c99a71178fffdbc62156e0f1b2ba471a17533eb4dc&X-Amz-SignedHeaders=host&x-id=GetObject"
     *           },
     *           {
     *               "cloudStorage": "oci",
     *               "filePath": "survey/5f72f9998925ec7c60f79a91//e7455f6c-468d-4fdf-9f6c-546d6b7d1370/uploadFile2.jpg",
     *               "url": "https://ax2cel5zyviy.compat.objectstorage.ap-hyderabad-1.oraclecloud.com/samiksha/survey/5f72f9998925ec7c60f79a91//e7455f6c-468d-4fdf-9f6c-546d6b7d1370/uploadFile2.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=3737771d26e1d8f211a04ec59cfd3037c8d1c6ff%2F20240802%2Fap-hyderabad-1%2Fs3%2Faws4_request&X-Amz-Date=20240802T051354Z&X-Amz-Expires=1800&X-Amz-Signature=6c86d4465d9150af2b7bccd0ce81624367447f67b6a5c9b88c40cfff7b5047f9&X-Amz-SignedHeaders=host&x-id=GetObject"
     *           }
     *       ]
     *   }
     */

    /**
      * Get Downloadable URL from cloud service.
      * @method
      * @name getDownloadableUrl
      * @param  {Request}  req  request body.
      * @returns {JSON} Response with status and message.
    */

    async getDownloadableUrl(req) {
        return new Promise(async (resolve, reject) => {

            try {

                //allows file array to be taken from req.query as well as req.body
                if(req.query.filePaths){
                  req.query.filePaths = req.query.filePaths.split(',').map(filePath => filePath.trim()).filter(filePath => filePath.length > 0);
                }

                let filePaths = req.query.filePaths || req.body.filePaths;

                let downloadableUrl =
                await filesHelpers.getDownloadableUrl(
                    filePaths
                );

                return resolve(downloadableUrl)

            } catch (error) {

                console.log(error);
                return reject({
                    status:
                        error.status ||
                        httpStatusCode["internal_server_error"].status,

                    message:
                        error.message
                        || httpStatusCode["internal_server_error"].message,

                    errorObject: error
                })

            }
        })

    }
    
    /**
      * upload the file to the cloud .
      * @method
      * @name upload
      * @param  {Request}  req  request body.
      * @returns {JSON} Response with status .
      * @apiParamExample {json} Response:
     * {
        "status": 200
       }
     */

  async upload(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let currentMoment = moment(new Date());
        let formattedDate = currentMoment.format("DD-MM-YYYY");
        if (!fs.existsSync(`${ROOT_PATH}/public/assets/${formattedDate}`)) {
          fs.mkdirSync(`${ROOT_PATH}/public/assets/${formattedDate}`);
        }
        let filename = path.basename(req.query.file);
        let localFilePath = `${ROOT_PATH}/public/assets/${formattedDate}/${filename}`;
        let uploadStatus
        // Use the Promise version of fs.writeFile
        
        if (req.headers["content-type"] === "application/octet-stream") {
          const binaryData = Buffer.from(req.body);
          await fs.promises.writeFile(localFilePath, binaryData);
          uploadStatus = await filesHelpers.upload(localFilePath, req.query.file);

          if(uploadStatus.status == 200){
            return resolve({
              status: httpStatusCode["ok"].status,
            });
          }
        } else if(req.headers["content-type"].split(";")[0] === "multipart/form-data"){
          const fileKey = Object.keys(req.files)[0];
          if (filename === req.files[fileKey].name) {
            await fs.promises.writeFile(localFilePath, req.files[fileKey].data);
            uploadStatus = await filesHelpers.upload(
              localFilePath,
              req.query.file
            );
            if(uploadStatus.status == 200){
              return resolve({
                status: httpStatusCode["ok"].status,
              });
            }
            
          } else {
            return reject({
              status: httpStatusCode["internal_server_error"].status,

              message: constants.apiResponses.FAILED_TO_VALIDATE_FILE,
            });
          }
        } else{
            return reject({
                status: httpStatusCode["internal_server_error"].status,
  
                message: constants.apiResponses.FAILED_TO_VALIDATE_FILE,
            });
        }
      } catch (error) {
        return reject({
          status:
            error.status || httpStatusCode["internal_server_error"].status,

          message:
            error.message || httpStatusCode["internal_server_error"].message,

          errorObject: error,
        });
      }
    });
  }

  async download(req) {
    return new Promise(async (resolve, reject) => {
      try {
        let file = req.query.file;
        let fileURL = await filesHelpers.getFileURLFromFilePath(file);
        return resolve({
          isResponseAStream:true,
          fileURL,
          file
        })

      } catch (error) {
        return reject({
          status:
            error.status || httpStatusCode["internal_server_error"].status,

          message:
            error.message || httpStatusCode["internal_server_error"].message,

          errorObject: error,
        });
      }
    });

}
};

