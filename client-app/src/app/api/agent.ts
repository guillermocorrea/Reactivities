import { Activity } from './../models/activity';
import axios, { AxiosResponse } from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => {
  return (response: AxiosResponse) => {
    return new Promise<AxiosResponse>(resolve =>
      setTimeout(() => resolve(response), ms)
    );
  };
};

const requests = {
  get: (url: string) =>
    axios
      .get(url)
      .then(sleep(1000))
      .then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody)
};

const Activities = {
  list: (): Promise<Activity[]> => requests.get('/activities'),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: Activity) => requests.post('/activities', activity),
  update: (id: string, activity: Activity) =>
    requests.put(`/activities/${id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`)
};

export default {
  Activities
};
