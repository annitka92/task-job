import {Component, OnInit, AfterViewInit, ViewChild, OnDestroy} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {TasksService} from "../../services/tasks.service";
import {Task} from "../../interfaces/task.interface";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {AddEditTaskComponent} from "../dialogs/add-edit-task/add-edit-task.component";
import {MatSelectChange} from "@angular/material/select";
import {AuthService} from "../../services/auth.service";
import Utils from "../../utils/utils";
import {first} from "rxjs/operators";
import {Router} from "@angular/router";

interface EnumTaskStatus {
  name: string
  value: string
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: String[] = ['username', 'email', 'text', 'status'];
  authSubscription;
  isAuth: Boolean = false;
  totalTaskCount: number = 0;
  // @ts-ignore
  public dataTableSource = new MatTableDataSource<Task>();
  sortParams: object = {
    sort_field: '',
    sort_direction: '',
    page: 1
  };
  // @ts-ignore
  selectedTaskStatus: EnumTaskStatus[] = [
    {
      name: 'notDone',
      value: 'Not Done'
    },
    {
      name: 'done',
      value: 'Done'
    }
  ];
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(private taskService: TasksService,
              private dialog: MatDialog,
              private router: Router,
              private authService: AuthService) {
    this.authSubscription = this.authService.currentTokenSubject.subscribe(res => (this.isAuth = res))
  }

  ngOnInit(): void {
    this.getTaskList(this.sortParams);
  }

  ngAfterViewInit(): void {
    this.dataTableSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  getTaskList(sortParams: object) {
    this.taskService.getTasksList(sortParams).pipe(first()).subscribe(
      (resp) => {
        const data = resp.message.tasks.map((task: Task) => {
          task.isEdited = (task.status === 1 || task.status === 11);
          return task;
        });
        this.totalTaskCount = resp.message.total_task_count;
        // @ts-ignore
        this.dataTableSource.data = data as Task[];
      });
  }

  checkStatus(status: string) {
    return String(status).length === 2 ? 'done' : 'notDone';
  }

  changeTaskStatus(e: MatSelectChange, task: Task) {
    // @ts-ignore
    const status = Utils.checkStatus(task.isEdited, e.value);
    const data = {
      id: task.id,
      text: task.text,
      status,
      token: localStorage.getItem('authToken')
    };
    this.taskService.editTask(data).subscribe(resp => {
      // @ts-ignore
      if (resp.status === 'ok') {
        this.getTaskList(this.sortParams);
      }
    });
  }

  pageChanged(e: any) {
    this.sortParams = {
      sort_field: this.sort.active,
      sort_direction: this.sort.direction,
      page: this.paginator.pageIndex + 1
    };
    this.getTaskList(this.sortParams);
  }

  openDialog(actionType: String, task?: Task) {
    const dialogConfig = {
      height: '400px',
      width: '600px',
      disableClose: true,
      autoFocus: true,
      data: {
        actionType,
        task
      }
    };
    const dialogRef = this.dialog.open(AddEditTaskComponent, dialogConfig);

    dialogRef.afterClosed().pipe(first()).subscribe(
      (data) => {
        if (data) {
          this.authService.logout();
          this.router.navigate(['login']);
        }
        this.getTaskList(this.sortParams);
      }
    );
  }
}
