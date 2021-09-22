import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../../interfaces/task.interface";
import {TasksService} from "../../../services/tasks.service";
import Utils from "../../../utils/utils";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-add-edit-task',
  templateUrl: './add-edit-task.component.html',
  styleUrls: ['./add-edit-task.component.scss']
})
export class AddEditTaskComponent implements OnInit {
  initialTaskData: Task = {
    email: '',
    username: '',
    text: '',
    status: 0,
    id: 0
  };
  // @ts-ignore
  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    text: new FormControl('', [Validators.required])
  });
  actionType: string;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddEditTaskComponent>,
              private taskService: TasksService,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.actionType = data.actionType;
    this.initialTaskData = data.task ? data.task : this.initialTaskData;
  }

  get form() {
    return this.profileForm.controls;
  }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      email: new FormControl(this.initialTaskData.email, [Validators.required, Validators.email]),
      username: new FormControl(this.initialTaskData.username, [Validators.required]),
      text: new FormControl(this.initialTaskData.text, [Validators.required])
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.profileForm.valid) {
      this.actionType === 'Add' ? this.addTask() : this.editTask();
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  addTask() {
    this.taskService.addTask(this.profileForm.value).pipe(first()).subscribe(resp => {
      // @ts-ignore
      if (resp.status === 'ok') {
        this.close()
      }
    })
  }

  editTask() {
    if (this.initialTaskData.text !== this.profileForm.value.text) {
      let data = this.profileForm.value;
      data.token = localStorage.getItem('authToken');
      data.id = this.initialTaskData.id;
      data.status = Utils.checkStatus(true, String(this.initialTaskData.status));
      this.taskService.editTask(data).pipe(first()).subscribe(resp => {
        // @ts-ignore
        if (resp.status === 'ok') {
          this.close();
        }
        // @ts-ignore
        if (resp.status === 'error' && resp.message.token) {
          this.dialogRef.close(true);
        }
      });
    }
  }

  validateField(field: string) {
    return `${this.form}.${field}.errors?.${field}` ||
      `${this.form}.${field}.dirty` || `${this.form}.${field}.touched`;
  }
}
