import axios from 'axios';

const base = process.env.NEXT_PUBLIC_API_ENDPOINT;

//API Endpoints
const userBase = `${base}/api/users`;
const authBase = `${base}/api/auth`;
const videosBase = `${base}/api/videos`;

export function registerUser(payload: {
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
}) {
  return axios.post(userBase, payload).then(res => res.data);
}
