import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryCard = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

input.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput (e) {
    const name = e.target.value.trim();

    if (name === '') {
        countryList.innerHTML = '';
        countryCard.innerHTML = '';
        return;
    }
        fetchCountries(name)
        .then(data => {
        console.log(data);
        renderCountriesList(data);
        })
        .catch((error) =>
            Notify.failure("Oops, there is no country with that name")
        )
};


function renderCountriesList(data) {
    // const [{ name, capital, population, languages, flags }] = data;

    if (data.length >10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
    } else if (data.length === 1) {
        let markup = data.map(({ name, capital, population, languages, flags }) => `<div class="country-card"><img class="flag-icon" src=${flags.svg} alt=${name.official} width=25 height=25><h1>${name.official}</h1></div><li><p><b>Capital</b>: ${capital}</p><p><b>Population</b>: ${population}</p><p><b>Languages</b>: ${Object.values(languages).join(', ')}</p></li>`);
        countryCard.innerHTML = markup;
        countryList.innerHTML = '';
    } else {
        let markup = data.map(({ name, flags }) => `<li class="item"><img class="flag-icon" src=${flags.svg} alt=${name.official} width=25 height=25><p>${name.official}</p></li>`).join('');
        countryList.innerHTML = markup;
        countryCard.innerHTML = '';
    }
};