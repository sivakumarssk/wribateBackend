const path = require('path');
const fs = require('fs').promises


const deleteFile=async(oldImgPath)=>{
    try {
        const fullPath=path.join(__dirname,'..',oldImgPath);
        // console.log(fullPath);

        try {
            await fs.access(fullPath)
        } catch (error) {
            console.error(`File does not exist: ${fullPath}`);
            return;
        }

        await fs.unlink(fullPath)
        console.log(`Successfully deleted old image: ${fullPath}`);
    } catch (error) {
        console.error(`Error deleting old image: ${error.message}`);
    }
}


const uploadFile=async(file,destination)=>{
    // console.log(file,destination,'caled');
    
    if(!file) return null

    const allowedExtensions = /png|jpeg|jpg|gif|pdf/;
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.test(fileExtension)) {
        return res.status(400).send('Only images (png, jpg, jpeg, gif,pdf) are allowed.');
    }

    // const uploadDir = path.join(__dirname, 'uploads');
    // if (!fs.existsSync(uploadDir)){
    //     fs.mkdirSync(uploadDir);
    // }



    const filename = `${Date.now()}${fileExtension}`;
    const uploadPath = path.join(__dirname, "..", "uploads", destination, filename);

    // console.log(__dirname);
    

    try {
        await file.mv(uploadPath);
        // console.log(`File uploaded to ${uploadPath}`);
        return `/uploads/${destination}/${filename}`;
    } catch (err) {
        console.error(`Error uploading file: ${err}`);
        return null;
    }
}


module.exports={ uploadFile,deleteFile }