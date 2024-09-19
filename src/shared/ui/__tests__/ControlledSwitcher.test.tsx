import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import {ControlledSwitcher} from '../ControlledSwitcher';
import {
  MockFormProvider,
  MockWrapperProvider,
} from '../../config/mocks/MockWrapperProvider';

describe('ControlledSwitcher', () => {
  it('renders correctly', () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledSwitcher name="testSwitch" label="Test Switch" />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const label = screen.getByText('Test Switch');
    const switchComponent = screen.getByRole('switch');

    expect(label).toBeOnTheScreen();
    expect(switchComponent).toBeOnTheScreen();
  });

  it('toggles switch value', () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledSwitcher name="testSwitch" label="Test Switch" />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const switchComponent = screen.getByRole('switch');

    expect(switchComponent.props.value).not.toBe(true);

    fireEvent(switchComponent, 'valueChange', true);
    expect(switchComponent.props.value).toBe(true);

    fireEvent(switchComponent, 'valueChange', false);
    expect(switchComponent.props.value).toBe(false);
  });

  it('disables the switch when disabled prop is true', () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledSwitcher name="testSwitch" label="Test Switch" disabled />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const switchComponent = screen.getByRole('switch');
    expect(switchComponent.props.disabled).toBe(true);
  });
});
