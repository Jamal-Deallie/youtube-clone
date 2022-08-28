import busboy from 'busboy';
import fs from 'fs';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Video } from './video.model';
import { createVideo, findVideo, findVideos } from './video.service';
import { UpdateVideoBody, UpdateVideoParams } from './video.schema';

//setting the file format for the video
const MIME_TYPES = ['video/mp4'];

//for performance reasons confirm the BYTES
const CHUNK_SIZE_IN_BYTES = 1000000; // 1mb

function getPath({
  videoId,
  extension,
}: {
  videoId: Video['videoId'];
  extension: Video['extension'];
}) {
  //the videos in the folder will be named after the videID with the MP4 extension
  return `${process.cwd()}/src/videos/${videoId}.${extension}`;
}
//uploading video
export async function uploadVideoHandler(req: Request, res: Response) {
  const bb = busboy({ headers: req.headers });

  const user = res.locals.user;
  //create video using service func "createVideo"
  const video = await createVideo({ owner: user._id });

  bb.on('file', async (_, file, info) => {
    //if the video is not a mp4 file send a bad request error
    if (!MIME_TYPES.includes(info.mimeType)) {
      return res.status(StatusCodes.BAD_REQUEST).send('Invalid file type');
    }
    //split the video/mp4 string to set 'mp4' as the extension of the video
    const extension = info.mimeType.split('/')[1];

    //set the path of the video using the getPath func above
    const filePath = getPath({
      videoId: video.videoId,
      extension,
    });
    //extract the video extension of mp4
    video.extension = extension;
    //save the video
    await video.save();

    const stream = fs.createWriteStream(filePath);

    file.pipe(stream);
  });
  //after the video has finished uploading respond to the client to close the connection
  bb.on('close', () => {
    res.writeHead(StatusCodes.CREATED, {
      Connection: 'close',
      'Content-Type': 'application/json',
    });

    res.write(JSON.stringify(video));
    res.end();
  });

  return req.pipe(bb);
}

//create a func to update the video obj after uploading is completed
export async function updateVideoHandler(
  req: Request<UpdateVideoParams, {}, UpdateVideoBody>,
  res: Response
) {
  //get id from client params web address
  const { videoId } = req.params;
  //get props from the request body
  const { title, description, published } = req.body;
  //get the id of the user
  const { _id: userId } = res.locals.user;
  //find the video associated with client and id
  const video = await findVideo(videoId);

  //send the error message if video is not found
  if (!video) {
    return res.status(StatusCodes.NOT_FOUND).send('Video not found');
  }

  //if the user id does not match send an error message
  if (String(video.owner) !== String(userId)) {
    return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized');
  }

  //otherwise update the video's title, desc, and published boolean to true
  video.title = title;
  video.description = description;
  video.published = published;

  //save the update
  await video.save();
  //send message to client that the update has been successful
  return res.status(StatusCodes.OK).send(video);
}

export async function streamVideoHandler(req: Request, res: Response) {
  const { videoId } = req.params;

  //Range HTTP request header indicates the part of a document that the server should return.
  //It tells what part of the document will be returned. It will tell which chunk of the document to send back
  const range = req.headers.range;
  //if there is no range return an error
  if (!range) {
    return res.status(StatusCodes.BAD_REQUEST).send('range must be provided');
  }

  //find the video
  const video = await findVideo(videoId);

  //If there is no video return an error
  if (!video) {
    return res.status(StatusCodes.NOT_FOUND).send('video not found');
  }

  //get the video path using the utils func getPath
  const filePath = getPath({
    videoId: video.videoId,
    extension: video.extension,
  });

  //get the file's size
  const fileSizeInBytes = fs.statSync(filePath).size;

  //get the chunk or part of the document you want to be returned
  const chunkStart = Number(range.replace(/\D/g, ''));

  const chunkEnd = Math.min(
    chunkStart + CHUNK_SIZE_IN_BYTES,
    fileSizeInBytes - 1
  );

  //find content length to set the header. It says where in the file is the chunk coming from
  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
    'Accept-Ranges': 'bytes',
    'Content-length': contentLength,
    'Content-Type': `video/${video.extension}`,
    'Cross-Origin-Resource-Policy': 'cross-origin',
  };

  res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);

  const videoStream = fs.createReadStream(filePath, {
    start: chunkStart,
    end: chunkEnd,
  });

  videoStream.pipe(res);
}

export async function findVideosHandler(_: Request, res: Response) {
  const videos = await findVideos();

  return res.status(StatusCodes.OK).send(videos);
}
