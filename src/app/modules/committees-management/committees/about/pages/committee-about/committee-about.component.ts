import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-committee-about',
  templateUrl: './committee-about.component.html',
  styleUrls: ['./committee-about.component.scss'],
})
export class CommitteeAboutComponent implements OnInit {

  id: number = 0;
  getDetails: boolean = false;

  @Input() public set committeeDetails(val: any) {
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    //get request id
    this.id = +this.route.snapshot.parent.params['id'];

    if (isNaN(this.id)) {
      this.goToNotFound();
      this.id = null;
    } else {
      this.getDetails = true;
    }
  }

  goToNotFound() {
    this.router.navigateByUrl(`/oops/not-found`);
  }
}
