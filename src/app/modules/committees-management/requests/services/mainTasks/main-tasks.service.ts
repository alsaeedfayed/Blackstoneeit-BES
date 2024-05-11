import { Injectable } from '@angular/core';
import { MainTask } from '../../models/MainTask';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainTasksService {

  //seleceted committee members
  selectedMainTask$ : BehaviorSubject<string> = new BehaviorSubject('')
  isValidTasksMembers : Subject<boolean> = new Subject()

  private MainTasks: MainTask[] = [];

  constructor() { }

  // get all MainTasks
  getMainTasks(): MainTask[] {
    return this.MainTasks;
  }

  // set the MainTasks
  setKMainTasks(mainTasks: MainTask[] = []) {
    this.MainTasks = mainTasks;
  }

  // get MainTask data
  getMainTaskByTitle(title: string): MainTask {
    return this.MainTasks.find(mainTask => mainTask.title === title);
  }

  //delete MainTask
  deleteMainTaskByTitle(title: string): boolean {
    let index = this.MainTasks.findIndex(t => t.title === title);
    if (index >= 0) {
      this.MainTasks.splice(index, 1);
      return true;
    } else
      return false;
  }

  // update MainTasks
  updateMainTask(mainTask: MainTask, index: number): boolean {
    if (this.isDuplicated(mainTask.title, mainTask.titleAr, index)) {
      return false;
    } else {
      this.MainTasks.splice(index, 1, mainTask);
      return true;
    }
  }

  // add new MainTask
  AddMainTask(mainTask: MainTask): boolean {
    if (this.isDuplicated(mainTask.title, mainTask.titleAr)) {
      return false;
    } else {
      this.MainTasks.push(mainTask);
      return true;
    }
  }

  isDuplicated(title: string, titleAr: string, index: number = -1): boolean {
    for (let i = 0; i < this.MainTasks.length; i++) {
      let MainTask = this.MainTasks[i];
      if (i != index && (MainTask.title == title || MainTask.titleAr == titleAr))
        return true;
    }
    return false;
  }

  getMainTaskIndex(title: string): number {
    let index = this.MainTasks.findIndex(mainTask => mainTask.title === title);
    return index;
  }
}
