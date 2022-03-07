import React from 'react';
import renderer from 'react-test-renderer';
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import { NewActivityScreen } from '../NewActivityScreen';
import { ActivitiesContext } from '../../hooks/useActivities';
import { testActivityContextData } from '../../constants/mocks/activity';

jest.useFakeTimers();

describe('Load NewActivityScreen', () => {
  it('should renders correctly', () => {
    const tree = renderer.create(<NewActivityScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('When an activity is clicked', () => {
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
    const { getByTestId, findByTestId } = render(
      <ActivitiesContext.Provider value={testActivityContextData}>
        <NewActivityScreen />
      </ActivitiesContext.Provider>
    );

    fireEvent.press(getByTestId('list-0'));
    const newRecordDialog = await waitFor(() =>
      getByTestId('new-record-dialog')
    );
    expect(newRecordDialog).toBeDefined();

    fireEvent.press(getByTestId('dialog-cancel-button'));
    const removedNode = await waitForElementToBeRemoved(() =>
      getByTestId('new-record-dialog')
    );
    expect(removedNode).toBeDefined();
  });
});
