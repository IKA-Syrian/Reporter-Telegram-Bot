const routes = require('express').Router();
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const { mediaInfoFactory } = require('mediainfo.js')
const Reports = require('../schemas/reports');

async function getMediaInfo(filePath) {
    const mediaInfo = await mediaInfoFactory({ format: 'object' });
    const fileSize = fs.statSync(filePath).size;
    return new Promise((resolve, reject) => {
        let offset = 0;
        const readChunk = async (chunkSize) => {
            return new Promise((resolve, reject) => {
                fs.open(filePath, 'r', (err, fd) => {
                    if (err) {
                        return reject(err);
                    }
                    const buffer = Buffer.alloc(chunkSize);
                    fs.read(fd, buffer, 0, chunkSize, offset, (err, bytesRead, buffer) => {
                        if (err) {
                            fs.close(fd, () => { });
                            return reject(err);
                        }
                        offset += bytesRead;
                        fs.close(fd, () => { });
                        resolve(buffer.slice(0, bytesRead));
                    });
                });
            });
        };

        mediaInfo.analyzeData(() => fileSize, readChunk)
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}



routes.post('/info', async (req, res) => {
    try {
        const { filePath, mimeType } = req.body;
        // const filepath = path.join(`${filePath}`);
        // console.log(filepath);
        console.log(filePath, mimeType);
        if (mimeType === 'image') {
            const fullPath = path.resolve(filePath); // Ensure the path is correctly resolved
            const info = await getMediaInfo(fullPath);
            res.send(info);
            // await sharp(fullPath)
            //     .metadata()
            //     .then(metadata => {
            //         res.send(metadata);
            //     })
            //     .catch(err => {
            //         console.error('Error retrieving media info:', err);
            //         res.status(500).send('Error retrieving media info: ' + err.message);
            //     });
        } else {
            ffmpeg.ffprobe(filePath, (error, metadata) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Video Metadata:', metadata.streams[1]);
                    res.send(metadata);
                }
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ "error": "Something went wrong" })
    }
})



routes.put('/downloadCount', async (req, res) => {
    try {
        const { file_unique_id, reportID } = req.body;
        const edetingReport = await Reports.findOne({ reportID });
        const prvAtachment = edetingReport.reportAttachments.find(attachment => attachment.file_unique_id === file_unique_id);
        const prvDownloadCount = prvAtachment.downloadCount;
        const newDownloadCount = prvDownloadCount + 1;
        const newAtachment = edetingReport.filter(attachment => attachment.file_unique_id !== file_unique_id);
        const newAttachment = { ...prvAtachment, downloadCount: newDownloadCount };
        await Reports.findOneAndUpdate({ reportID }, { reportAttachments: [...newAtachment, newAttachment] });
        res.send({ "message": "Download count updated successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).send({ "error": "Something went wrong" })
    }
})



module.exports = routes;