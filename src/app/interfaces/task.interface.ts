export interface Task {
  id?: number,
  username: string,
  email: string,
  text: string,
  status?: number,
  isEdited? : boolean
}
