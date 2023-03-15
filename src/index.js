import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
function deleteMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
input.addEventListener(
  'input',
  debounce(evt => {
    const trimmedName = input.value.trim();
    deleteMarkup();
    if (trimmedName !== '') {
      fetchCountries(trimmedName).then(foundCountries => {
        if (foundCountries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (foundCountries.length >= 2 && foundCountries.length <= 10) {
          insertCountryList(foundCountries);
        } else if (foundCountries.length === 1) {
          insertOneCountry(foundCountries);
        } else if (foundCountries.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      });
    }
  }, DEBOUNCE_DELAY)
);
function insertCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
         <p>${country.name.official}</p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}
function insertOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
         <p>${country.name.official}</p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}
