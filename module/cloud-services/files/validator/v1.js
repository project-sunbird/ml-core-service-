/**
 * name : cloud-services/files/validator/v1.js
 * author : Aman
 * created-date : 07-Apr-2021
 * Description : Files validator.
 */

module.exports = (req) => {

    let filesValidator = {
        preSignedUrls : function() {
            req.checkBody('request').exists().withMessage("request data is required");
            req.checkBody('ref').exists().withMessage("required reference type");
        },
        download : function() {
            req.checkQuery('file').exists().withMessage("request file is required");
            req.checkQuery('file').notEmpty().withMessage("file parameter cannot be empty");

        }
    }

    if (filesValidator[req.params.method]) {
        filesValidator[req.params.method]();
    }

};