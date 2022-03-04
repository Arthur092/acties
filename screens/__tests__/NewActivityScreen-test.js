import React, { Profiler } from 'react';
import renderer from 'react-test-renderer';
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import { NewActivityScreen } from '../NewActivityScreen';
import { ActivitiesContext } from '../../hooks/useActivities';

jest.useFakeTimers();

describe('Load NewActivityScreen', () => {
  it('should renders correctly', () => {
    const tree = renderer.create(<NewActivityScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('When an activity is clicked', () => {
  const testActivityContextData = {
    activityTypes: {
      data: [
        {
          id: 'testid',
          name: 'testType',
          isQuantity: 1,
          iconName: 'gas-station',
          iconColor: 'red',
          userId: 'testUserId',
        },
      ],
      isLoading: false,
    },
    records: {
      data: [],
      isLoading: false,
    },
    getActivityTypes: () => null,
    getRecords: () => null,
  };

  it('should show the dialog', async () => {
    const { getByTestId, debug } = render(
      <ActivitiesContext.Provider value={testActivityContextData}>
        <NewActivityScreen />
      </ActivitiesContext.Provider>
    );

    fireEvent.press(getByTestId('list-0'));
    const newRecordDialog = await waitFor(() =>
      getByTestId('new-record-dialog')
    );
    expect(newRecordDialog).toBeDefined();
  });

  it('should dissmiss the dialog', async () => {
    const { getByTestId, debug } = render(
      <ActivitiesContext.Provider value={testActivityContextData}>
        <NewActivityScreen />
      </ActivitiesContext.Provider>
    );

    fireEvent.press(getByTestId('list-0'));
    const newRecordDialog = await waitFor(() =>
      getByTestId('new-record-dialog')
    );

    fireEvent.press(getByTestId('dialog-cancel-button'));
    const newRecordDialogAfter = await waitForElementToBeRemoved(() =>
      getByTestId('new-record-dialog')
    );

    expect(newRecordDialogAfter).toBeDefined();
  });
});
