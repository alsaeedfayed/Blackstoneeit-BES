import { Injectable } from '@angular/core';
import { HttpHandlerService } from 'src/app/core/services/http-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectCommentsService {


  constructor(private http: HttpHandlerService,) { }


  getProjectComments(projectId) {
    return this.http.get(`/Eppm/api/Comment/${projectId}`)
  }

  toogleCommentLike(commentId) {
    return this.http.post(`/Eppm/api/Comment/Like/${commentId}`)
  }

  createComment(config) {
    return this.http.post("/Eppm/api/Comment/Add", config)
  }

}
