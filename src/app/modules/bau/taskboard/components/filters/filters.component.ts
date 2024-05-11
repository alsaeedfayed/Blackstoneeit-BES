import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Config } from "src/app/core/config/api.config";
import { HttpHandlerService } from "src/app/core/services/http-handler.service";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.scss"],
})
export class FiltersComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<string>();

  years = ["2023", "2024"];
  selectedYear: string;

  form: FormGroup;
  sector: any[] = [];
  department: any[] = [];
  section: any[] = [];
  isLoading: boolean = true;

  lang = this.translateService.currentLang;
  constructor(
    private translateService: TranslateService,
    private httpService: HttpHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getMyHirerchy();
    this.initForm();
    this.handleLangChange();
    this.selectedYear = this.route.parent.snapshot.paramMap.get("year");
  }

  handleLangChange() {
    this.translateService.onLangChange.subscribe(language => {
      this.lang = language.lang;
    });
  }

  initForm() {
    this.form = this.fb.group({
      sector: this.fb.control(null),
      department: this.fb.control(null),
      section: this.fb.control(null),
      year: this.fb.control(null, [Validators.required]),
    });
    this.handelSelectSerctor();
  }

  setLocalStorageValues() {
    let localStorageData: any = {};

    const storedData = localStorage.getItem("BAUSearchbarValues");
    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);
      if (parsedData && typeof parsedData === "object") {
        localStorageData = parsedData;
      }
    }
    // Set form values from local storage after getting form selectors' data
    this.form.patchValue({
      sector: localStorageData.sector || null,
      department: localStorageData.department || null,
      section: localStorageData.section || null,
      year: this.selectedYear || localStorageData.year || null,
    });

    // Trigger the search function if the 'BAUSearchbarValues' item exists and 'year' is set
    if (storedData !== null && localStorageData.year) {
      this.onSearch(); // Call your search function here
    }
  }

  getMyHirerchy() {
    this.isLoading = true;
    this.httpService.get(Config.FollowUp.GetMyHirerchy).subscribe(res => {
      this.isLoading = false;

      this.sector = res;
      // set selectros from local storage after fetching selectors data
      this.setLocalStorageValues();
    });
  }

  handelSelectSerctor() {
    const sector = this.form.get("sector");
    const department = this.form.get("department");
    sector.valueChanges.subscribe(value => {
      this.handelFindDepartments(value);
    });
    department.valueChanges.subscribe(value => {
      this.handelFindSections(value);
    });
  }

  handelFindDepartments(sectorid: number) {
    const sector = this.sector.find(sector => sectorid == sector.id);
    this.department = sector ? sector.departments : [];
    this.form.get("department").setValue(null);
  }

  handelFindSections(departmentid: number) {
    const department = this.department.find(
      department => departmentid == department.id
    );
    this.section = department ? department.sections : [];
    this.form.get("section").setValue(null);
  }

  onSearch() {
    localStorage.setItem("BAUSearchbarValues", JSON.stringify(this.form.value));
    const selectedYear = this.form.value.year?.toString();
    const groupId =
      this.form.value.section?.toString() ||
      this.form.value.department?.toString() ||
      this.form.value.sector?.toString() ||
      null;

    const searchData: any = {
      selectedYear,
      groupId,
    };
    const objectString = JSON.stringify(searchData);
    this.router.navigate([`/bau/taskboard/${selectedYear}`], { queryParams: { data: objectString } });
    this.searchEvent.emit(searchData);
  }
}
