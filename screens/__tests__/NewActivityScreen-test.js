/* eslint-disable no-undef */
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
import { RecordsContext } from '../../hooks/useRecords';
import { AuthContext } from '../../hooks/useAuth';
import { testActivityContextData } from '../../constants/mocks/activity';
import { testAuthContextData } from '../../constants/mocks/auth';

jest.mock('../../firebase');
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
        <RecordsContext.Provider>
          <NewActivityScreen />
        </RecordsContext.Provider>
      </ActivitiesContext.Provider>
    );

    fireEvent.press(getByTestId('list-0'));
    const newRecordDialog = await waitFor(() =>
      getByTestId('new-record-dialog')
    );
    expect(newRecordDialog).toBeDefined();
  });

  it('should dissmiss the dialog', async () => {
    const { getByTestId } = render(
      <ActivitiesContext.Provider value={testActivityContextData}>
        <RecordsContext.Provider>
          <NewActivityScreen />
        </RecordsContext.Provider>
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

describe('When dialog is opened', () => {
  it('should change qty input value', async () => {
    const { getByTestId } = render(
      <ActivitiesContext.Provider value={testActivityContextData}>
        <RecordsContext.Provider>
          <NewActivityScreen />
        </RecordsContext.Provider>
      </ActivitiesContext.Provider>
    );

    fireEvent.press(getByTestId('list-0'));
    await waitFor(() => getByTestId('new-record-dialog'));

    const qtyInput = getByTestId('input-qty');
    fireEvent.changeText(qtyInput, '100');
    expect(qtyInput.props.value).toBe('100');
  });

  it('should submit the modal', async () => {
    const { getByTestId, findByText } = render(
      <AuthContext.Provider value={testAuthContextData}>
        <ActivitiesContext.Provider value={testActivityContextData}>
          <RecordsContext.Provider>
            <NewActivityScreen />
          </RecordsContext.Provider>
        </ActivitiesContext.Provider>
      </AuthContext.Provider>
    );

    fireEvent.press(getByTestId('list-0'));
    await waitFor(() => getByTestId('new-record-dialog'));

    const qtyInput = getByTestId('input-qty');
    fireEvent.changeText(qtyInput, '100');
    fireEvent.press(getByTestId('dialog-done-button'));
    const successMessage = await findByText('New record added successfuly!');

    expect(successMessage).toBeDefined();
  });

  it('should show an error if input is empty', async () => {
    const { getByTestId } = render(
      <AuthContext.Provider value={testAuthContextData}>
        <ActivitiesContext.Provider value={testActivityContextData}>
          <RecordsContext.Provider>
            <NewActivityScreen />
          </RecordsContext.Provider>
        </ActivitiesContext.Provider>
      </AuthContext.Provider>
    );

    fireEvent.press(getByTestId('list-0'));
    await waitFor(() => getByTestId('new-record-dialog'));

    const qtyInput = getByTestId('input-qty');
    fireEvent.changeText(qtyInput, '');
    fireEvent.press(getByTestId('dialog-done-button'));

    const errorMsg = await waitFor(() => getByTestId('input-qty-error'));

    expect(errorMsg).toBeDefined();
  });
});
