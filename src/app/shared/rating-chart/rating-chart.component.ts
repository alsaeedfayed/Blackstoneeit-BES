import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from "@angular/core";

@Component({
  selector: "rating-chart",
  templateUrl: "./rating-chart.component.html",
  styleUrls: ["./rating-chart.component.scss"],
})
export class RatingChartComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() data;
  rateBox = [
    { value: 1, progress: 0, count: 0 },
    { value: 2, progress: 0, count: 0 },
    { value: 3, progress: 0, count: 0 },
    { value: 4, progress: 0, count: 0 },
    { value: 5, progress: 0, count: 0 },
  ];
  totalReviews = 0;
  globalValue = 0;
  @ViewChild("two") two: ElementRef;
  reviews = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.data?.forEach(element => {
      this.reviews[element.rating] = element.count;
    });
    this.updateValues();
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.data.forEach(element => {
        this.reviews[element.rating] = element.count;
      });
      this.updateValues();
      this.cdRef.detectChanges();
    }
  }

  updateValues() {
    this.rateBox.forEach(box => {
      this.rateBox[this.rateBox.indexOf(box)].count = this.nFormat(
        this.reviews[box.value]
      );

      this.rateBox[this.rateBox.indexOf(box)].progress = Math.round(
        (this.reviews[box.value] / this.getTotal(this.reviews)) * 100
      );
    });
    this.totalReviews = this.getTotal(this.reviews);
    this.finalRating();
  }

  getTotal(reviews): number {
    return Object.values(reviews).reduce(
      (a: number, b: number) => a + b
    ) as number;
  }

  finalRating() {
    let final = Object.entries(this.reviews)
      .map(val => Number(val[0]) * val[1])
      .reduce((a, b) => a + b);
    let ratingValue = this.nFormat(
      parseFloat((final / this.getTotal(this.reviews)).toString()).toFixed(1)
    );
    this.globalValue = ratingValue;
    if (this.two?.nativeElement) {
      this.two.nativeElement.style.background = `linear-gradient(to right, #ffb700 ${
        (ratingValue / 5) * 100
      }%, transparent 0%)`;
    }
  }

  nFormat(number) {
    if (number >= 1000 && number < 1000000) {
      return `${number.toString().slice(0, -3)}k`;
    } else if (number >= 1000000 && number < 1000000000) {
      return `${number.toString().slice(0, -6)}m`;
    } else if (number >= 1000000000) {
      return `${number.toString().slice(0, -9)}md`;
    } else if (number === "NaN" || Number.isNaN(number)) {
      return `0.0`;
    } else {
      return number;
    }
  }
}
