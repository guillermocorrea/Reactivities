import React, { SyntheticEvent } from 'react';
import { Grid } from 'semantic-ui-react';

import { Activity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface Props {
  activities: Activity[];
  selectActivity: (id: string) => void;
  selectedActivity: Activity | null;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: Activity | null) => void;
  createActivity: (activity: Activity) => void;
  editActivity: (activity: Activity) => void;
  deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, activity: Activity) => void;
  submitting: boolean;
  target: string;
}

export const ActivitiesDashboard: React.FC<Props> = ({
  activities,
  selectActivity,
  selectedActivity,
  editMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
  editActivity,
  deleteActivity,
  submitting,
  target
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
          submitting={submitting}
          target={target}
        ></ActivityList>
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {editMode && (
          <ActivityForm
            key={(selectedActivity && selectedActivity.id) || 0}
            selectedActivity={selectedActivity!}
            setEditMode={setEditMode}
            createActivity={createActivity}
            editActivity={editActivity}
            submitting={submitting}
          ></ActivityForm>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ActivitiesDashboard;
