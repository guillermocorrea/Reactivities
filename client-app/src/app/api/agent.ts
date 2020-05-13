import { Profile, Photo } from './../models/profile';
import { UserFormValues } from './../models/user';
import { history } from './../../index';
import { Activity } from './../models/activity';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { User } from 'app/models/user';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error');
  }
  const { status, data, config } = error.response;
  if (status === 404) {
    history.push('/notfound');
  }
  if (
    config.method === 'get' &&
    status === 400 &&
    data.errors.hasOwnProperty('id')
  ) {
    history.push('/notfound');
  }
  if (status === 500) {
    toast.error('Server error - Please try again later.');
  }
  console.log(error.response);
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => {
  return (response: AxiosResponse) => {
    return new Promise<AxiosResponse>((resolve) =>
      setTimeout(() => resolve(response), ms)
    );
  };
};

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    const formData = new FormData();
    formData.append('File', file);
    return axios
      .post(url, formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (): Promise<Activity[]> => requests.get('/activities'),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: Activity) => requests.post('/activities', activity),
  update: (id: string, activity: Activity) =>
    requests.put(`/activities/${id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.del(`/activities/${id}/attend`),
};

const UserService = {
  current: (): Promise<User> => requests.get('/user'),
  login: (user: UserFormValues): Promise<User> =>
    requests.post('/user/login', user),
  register: (user: UserFormValues): Promise<User> =>
    requests.post('/user/register', user),
};

const Profiles = {
  get: (username: string): Promise<Profile> =>
    requests.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob): Promise<Photo> =>
    requests.postForm(`/photos`, photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`),
};

export default {
  Activities,
  UserService,
  Profiles,
};
