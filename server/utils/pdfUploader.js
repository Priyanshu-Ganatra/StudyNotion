const cloudinary = require("cloudinary").v2

exports.uploadPdfToCloudinary = async (file, folder) => {
  const options = { folder }
  options.resource_type = "auto"
  // console.log("OPTIONS", options)
  return await cloudinary.uploader.upload(file.tempFilePath, options)
}
