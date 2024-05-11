import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Config } from 'src/app/core/config/api.config';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';
import { RequestsService } from '../../services/requests.service';
import { IHistory } from './iHistory.interface';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit {
  isLoading: boolean;
  allHistory: IHistory[] = [];
  history: IHistory[] = [];
  pageSize: number = 5;
  startIndex: number = 0;

  constructor(
    private httpHandlerService: HttpHandlerService,
    private route: ActivatedRoute,
    private requestsService: RequestsService
  ) {
    this.requestsService.refresh.subscribe(() => {
      this.getRequestId();
    });
  }

  ngOnInit() {
    this.getRequestId();
  }

  getRequestId() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.getHistory(id);
    });
  }

  getHistory(id: string) {
    this.isLoading = true;
    this.httpHandlerService
      .get(Config.requests.getHistory + '?serviceRequestId=' + id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.allHistory = res.history;
        this.history = this.allHistory.slice(this.startIndex, this.pageSize);
      });
  }

  loadMore() {
    this.startIndex = this.startIndex + this.pageSize;
    let endIndex = this.startIndex + this.pageSize;
    if (endIndex > this.allHistory.length) {
      endIndex = this.allHistory.length;
    }
    const newHistory: IHistory[] = this.allHistory.slice(
      this.startIndex,
      endIndex
    );
    this.history.push(...newHistory);
  }

  get showLoadMore() {
    return this.history.length < this.allHistory.length;
  }
}
