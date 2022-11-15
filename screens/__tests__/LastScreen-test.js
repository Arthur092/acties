/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';
import LastScreen from '../LastScreen';
import { testActivityContextData } from '../../constants/mocks/activity';
import { ActivitiesContext } from '../../hooks/useActivities';
import { RecordsContext } from '../../hooks/useRecords';

jest.useFakeTimers();

describe('Load LastScreen', () => {
  it('should renders correctly', () => {
    const tree = renderer
      .create(
        <ActivitiesContext.Provider value={testActivityContextData}>
          <RecordsContext.Provider>
            <LastScreen />
          </RecordsContext.Provider>
        </ActivitiesContext.Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should renders with different value', () => {
    const { getByTestId } = render(
      <ActivitiesContext.Provider value={testActivityContextData}>
        <RecordsContext.Provider>
          <LastScreen />
        </RecordsContext.Provider>
      </ActivitiesContext.Provider>
    );
  });
});
