import { Attendee } from './../../models/activity';
import { Activity } from 'app/models/activity';
import { User } from 'app/models/user';
export const combinedDateAndTime = (date: Date, time: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return new Date(year, month, day, time.getHours(), time.getMinutes());
};

export const setActivityProps = (activity: Activity, user: User) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    (a) => a.username === user?.username
  );
  activity.isHost = activity.attendees.some(
    (a) => a.username === user?.username && a.isHost
  );
  return activity;
};

export const createAttendee = (user: User): Attendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!,
  };
};
