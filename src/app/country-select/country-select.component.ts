import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map } from 'rxjs/operators';

interface Country {
  name: string;
}

@Component({
  selector: 'app-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.css']
})

export class CountrySelectComponent implements OnInit {
  showList = false;
  private countriesUrl = 'https://restcountries.com/v2/all';
  countryControl = new FormControl();
  filteredCountries$!: Observable<Country[]>;
  countries: Country[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadCountries().subscribe(countries => this.countries = countries);

    this.filteredCountries$ = this.countryControl.valueChanges.pipe(
      debounceTime(200),
      map(value => this.filterCountries(value))
    );
  }

  loadCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesUrl).pipe(
      catchError(() => {
        console.error('An error occurred while fetching countries.');
        return of([]);
      })
    );
  }

  hideList() {
    setTimeout(() => this.showList = false, 200);
  }

  filterCountries(val: string): Country[] {
    return this.countries.filter(country =>
      country.name.toLowerCase().includes(val.toLowerCase())
    );
  }

  selectCountry(country: Country) {
    this.countryControl.setValue(country.name);
    this.showList = false;
  }
}
