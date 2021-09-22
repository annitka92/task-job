export default class Utils {
  static transformDataToFormGroup(data: object): object {
    const keys = Object.keys(data);
    const formData = new FormData();
    for (let i = 0; i < keys.length; i++) {
      // @ts-ignore
      formData.append(keys[i], data[keys[i]]);
    }
    return formData;
  }

  static checkStatus(isEdited: boolean, status: string) {
    if (isEdited && (status === 'notDone' || status === '0')) {
      return 1;
    } else if (isEdited && (status === 'done' || status === '10')) {
      return 11;
    } else if (!isEdited && (status === 'notDone' || status === '0')) {
      return 0;
    } else if (!isEdited && (status === 'done' || status === '10')) {
      return 10;
    } else {
      return Number(status)
    }
  }
}
