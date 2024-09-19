import {Alert, ToastAndroid} from 'react-native';
import {showConfirmationAlert, showToastMessage} from '../message';

describe('showToastMessage', () => {
  it('should call ToastAndroid.show with the correct message and duration', () => {
    const spy = jest.spyOn(ToastAndroid, 'show');
    const message = 'This is a toast message';
    showToastMessage(message, ToastAndroid.SHORT);

    expect(spy).toHaveBeenCalledWith(message, ToastAndroid.SHORT);
  });

  it('should call ToastAndroid.show with the default duration when none is provided', () => {
    const spy = jest.spyOn(ToastAndroid, 'show');
    const message = 'This is a toast message';
    showToastMessage(message);

    expect(spy).toHaveBeenCalledWith(message, ToastAndroid.SHORT);
  });
});

describe('showConfirmationAlert', () => {
  it('should call Alert.alert with the correct parameters', async () => {
    const spy = jest.spyOn(Alert, 'alert');
    const title = 'Confirmation';
    const message = 'Are you sure?';
    const okButtonText = 'Yes';

    const promise = showConfirmationAlert(title, message, okButtonText);
    expect(spy).toHaveBeenCalledWith(
      title,
      message,
      [
        {text: 'cancel', onPress: expect.any(Function), style: 'cancel'},
        {text: okButtonText, onPress: expect.any(Function), style: 'default'},
      ],
      {cancelable: true},
    );

    const okButton = spy.mock.calls[0][2]?.[1];
    await okButton?.onPress?.();

    await expect(promise).resolves.toBeUndefined();
  });

  it('should call reject when cancel button is pressed', async () => {
    const spy = jest.spyOn(Alert, 'alert');
    const title = 'Confirmation';
    const message = 'Are you sure?';
    const okButtonText = 'Yes';

    const promise = showConfirmationAlert(title, message, okButtonText);
    const cancelButton = spy.mock.calls[0][2]?.[0];

    await cancelButton?.onPress?.();

    await expect(promise).rejects.toBeUndefined();
  });
});
