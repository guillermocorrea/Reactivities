export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  city: string;
  venue: string;
  isGoing: boolean;
  isHost: boolean;
  attendees: Attendee[];
}

export interface ActivityFormValues extends Partial<Activity> {
  time?: Date;
}

export class ActivityFormViewModel implements ActivityFormValues {
  id?: string = undefined;
  title?: '';
  description?: '';
  category?: '';
  date?: undefined;
  time?: undefined;
  city?: '';
  venue?: '';

  constructor(fromActivity?: ActivityFormValues) {
    if (fromActivity && fromActivity.date) {
      fromActivity.time = fromActivity.date;
    }
    Object.assign(this, fromActivity);
  }
}

export interface Attendee {
  username: string;
  displayName: string;
  image: string;
  isHost: boolean;
}
