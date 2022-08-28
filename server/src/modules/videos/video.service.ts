import { Video, VideoModel } from "./video.model";

//upload video and set as obj. The user can set title, etc after
export function createVideo({ owner }: { owner: string }) {
  return VideoModel.create({ owner });
}

//finds video for streaming
export function findVideo(videoId: Video["videoId"]) {
  return VideoModel.findOne({ videoId });
}

export function findVideos() {
  return VideoModel.find({
    published: true,
    //When documents are queried, they are returned as Mongoose Documents by default. With the Mongoose lean() method, the documents are returned as plain objects.
  }).lean();
}