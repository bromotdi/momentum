
import playList from './playList.js';
import i18next from './i18next.js';


const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const nameInput = document.querySelector('.name');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');
const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const audio = new Audio();
const playAudioButton = document.querySelector('.play');
const playPrevButton = document.querySelector('.play-prev');
const playNextButton = document.querySelector('.play-next');
const progressBar = document.querySelector('.progress-bar');
const playerTrackInfo = document.querySelector('.player-track-info');
const playerTimeInfo = document.querySelector('.player-time-info');
const mute = document.querySelector('.mute');
const volume = document.querySelector('.volume');
const language = document.querySelector('#language');
const imageSource = document.querySelector('#image-source');
const tags = document.querySelector('#tags');
const tagsContainer = document.querySelector('.tags-container');
const settingsBtn = document.querySelector('.settings-btn');
const timeCheckboxInput = document.querySelector('#time-checkbox-input');
const dateCheckboxInput = document.querySelector('#date-checkbox-input');
const greetingCheckboxInput = document.querySelector('#greeting-checkbox-input');
const quoteCheckboxInput = document.querySelector('#quote-checkbox-input');
const weatherCheckboxInput = document.querySelector('#weather-checkbox-input');
const playerCheckboxInput = document.querySelector('#player-checkbox-input');
const settingsContainer = document.querySelector('.settings-container');
const overlay = document.querySelector('.overlay');


let playNum = 0;
let timeOfDay, randomNum;
let volumeValue = 0.5;
let flickrData;
let flickrImageUrls = [];
createPlaylist();

function createPlaylist() {
  const playListcontainer = document.querySelector('.play-list');
  playList.forEach(el => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.textContent = el.title;
  playListcontainer.append(li);
  })
}

const playItems = document.querySelectorAll('.play-item');
playItems[playNum].classList.add('item-active');

function showTime() {
  const currentRawDate = new Date();
  const currentTime = currentRawDate.toLocaleTimeString('ru');
  const dateOptions = {weekday: 'long', month: 'long', day: 'numeric'};
  const currentDate = capitalizeFirstLetter(currentRawDate.toLocaleDateString(i18next.t('locale'), dateOptions));
  const hours = currentRawDate.getHours();
  time.textContent = currentTime;
  date.textContent = currentDate;
  greeting.textContent = `${getTimeOfDayGreeting(hours)}, `;
  setTimeout(showTime, 1000);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTimeOfDayGreeting(hours) {
  if (hours >= 6 && hours < 12) {
    timeOfDay = 'morning';
    return i18next.t('good morning');
  } else if (hours >= 12 && hours < 18) {
    timeOfDay = 'afternoon';
    return i18next.t('good afternoon');
  }
  if (hours >= 18 && hours <= 23) {
    timeOfDay = 'evening';
    return i18next.t('good evening');
  } else {
    timeOfDay = 'night';
    return i18next.t('good night');    
  }
}


function updatePlaceholders() {
  nameInput.placeholder = i18next.t('name-placeholder');
  city.placeholder = i18next.t('city-placeholder');
}



function setLocalStorage() {
  localStorage.setItem('name', nameInput.value);
  localStorage.setItem('city', city.value);
  localStorage.setItem('timeDisplay', timeCheckboxInput.checked);
  localStorage.setItem('dateDisplay', dateCheckboxInput.checked);
  localStorage.setItem('greetingDisplay', greetingCheckboxInput.checked);
  localStorage.setItem('quoteDisplay', quoteCheckboxInput.checked);
  localStorage.setItem('weatherDisplay', weatherCheckboxInput.checked);
  localStorage.setItem('playerDisplay', playerCheckboxInput.checked);
  localStorage.setItem('language', language.value);
  localStorage.setItem('imageSource', imageSource.value);
  localStorage.setItem('tags', tags.value);
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem('name')) {
    nameInput.value = localStorage.getItem('name');
  }
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }
  if (localStorage.getItem('language')) {
    language.value = localStorage.getItem('language');
  }
  if (localStorage.getItem('imageSource')) {
    imageSource.value = localStorage.getItem('imageSource');
  }
  if (localStorage.getItem('tags')) {
    tags.value = localStorage.getItem('tags');
  }
  if (localStorage.getItem('timeDisplay')) {
    timeCheckboxInput.checked = (localStorage.getItem('timeDisplay') === 'true');
  }
  if (localStorage.getItem('dateDisplay')) {
    dateCheckboxInput.checked = (localStorage.getItem('dateDisplay') === 'true');
  }
  if (localStorage.getItem('greetingDisplay')) {
    greetingCheckboxInput.checked = (localStorage.getItem('greetingDisplay') === 'true');
  }
  if (localStorage.getItem('quoteDisplay')) {
    quoteCheckboxInput.checked = (localStorage.getItem('quoteDisplay') === 'true');
  }
  if (localStorage.getItem('weatherDisplay')) {
    weatherCheckboxInput.checked = (localStorage.getItem('weatherDisplay') === 'true');
  }
  if (localStorage.getItem('playerDisplay')) {
    playerCheckboxInput.checked = (localStorage.getItem('playerDisplay') === 'true');
  }
  
hideAndShowElements();
setBg();
}


window.addEventListener('load', getLocalStorage);


function getRandomNum() {
  randomNum = Math.floor(Math.random() * (20) + 1);
}

async function setBg() {
  const img = new Image();
  let resolution;
  let res, data, url;
  let tag = timeOfDay + ' nature';
  let bgNum = randomNum.toString().padStart(2, '0');
  if (tags.value !== '') {
    tag = tags.value; 
    resolution = 'url_l';
  } else {
    tag = timeOfDay + ' nature';
    resolution = 'url_h';
  }
  switch (imageSource.value) {
    case 'unsplash':
      tagsContainer.classList.remove('hidden');
      url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}&client_id=Qx2EKWv5QDemw9nwDeX1WvjNTnhUfJpLFcgUkHrOkVo`;
      res = await fetch(url);
      data = await res.json();
      img.src = data.urls.regular;  
      break;
    case 'flickr': 
      tagsContainer.classList.remove('hidden');
      if (flickrImageUrls.length === 0) {
        if (tags.value === '') {
          switch (timeOfDay) {
            case 'morning': 
              url = `https://www.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=ef14d6c9041b685545cead77b51ff507&gallery_id=72157720069530982&extras=${resolution}&format=json&nojsoncallback=1`;
              break;
            case 'afternoon': 
              url = `https://www.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=ef14d6c9041b685545cead77b51ff507&gallery_id=72157720111881805&extras=${resolution}&format=json&nojsoncallback=1`;
              break;
            case 'evening':
              url = `https://www.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=ef14d6c9041b685545cead77b51ff507&gallery_id=72157720111880160&extras=${resolution}&format=json&nojsoncallback=1`;
              break;
            case 'night':
              url = `https://www.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=ef14d6c9041b685545cead77b51ff507&gallery_id=72157720062587146&extras=${resolution}&format=json&nojsoncallback=1`;
              break;
            default: 
              url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=ef14d6c9041b685545cead77b51ff507&tags=${tag}&extras=${resolution}&format=json&nojsoncallback=1`;
          }
        } else {
          url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=ef14d6c9041b685545cead77b51ff507&tags=${tag}&extras=${resolution}&format=json&nojsoncallback=1`;
        }
          res = await fetch(url);
          flickrData = await res.json();
          for (let i = 0; i < 20; i++) {
            switch (resolution)   {
              case 'url_h': 
                flickrImageUrls[i] = flickrData.photos.photo[i].url_h;  
                break;
              default:
                flickrImageUrls[i] = flickrData.photos.photo[i].url_l;
            }
            }
        img.src = flickrImageUrls[randomNum - 1]; 
      } else {
          img.src = flickrImageUrls[randomNum - 1];  
      }
      break;
    default: 
      tagsContainer.classList.add('hidden');
      img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  }

  img.onload = () => {
    body.style.backgroundImage = `url('${img.src}')`;
  }
}


function getSlideNext() {
  if (randomNum === 20) {
    randomNum = 1;
  } else {
    randomNum++;
  }
  setBg()
}

function getSlidePrev() {
  if (randomNum === 1) {
    randomNum = 20;
  } else {
    randomNum--;
  }
  setBg()
}

function changeTag() {
  flickrImageUrls = [];
  setBg()
}


slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);
imageSource.addEventListener('change', setBg);
tags.addEventListener('change', changeTag);

async function getWeather() {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=Минск&lang=${i18next.t('lng')}&appid=49631e36b8c2c85f52a1e73c4267a87f&units=metric`;
  if (city.value !== '') {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${i18next.t('lng')}&appid=49631e36b8c2c85f52a1e73c4267a87f&units=metric`;
  }

  const res = await fetch(url);
  const data = await res.json();
  weatherIcon.className = 'weather-icon owf';
  if (res.status === 200) {
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${i18next.t('wind speed')}: ${Math.round(data.wind.speed)} ${i18next.t('m-s')}`;
    humidity.textContent = `${i18next.t('humidity')}: ${data.main.humidity}%`;
    weatherError.textContent = '';
  } else {
    weatherError.textContent = `Error, ${data.message}!`;
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';    
  }

}

city.addEventListener('change', getWeather);

async function getQuotes() {
  const quotes = `assets/quotes/data-${i18next.t('lng')}.json`;
  const res = await fetch(quotes);
  const data = await res.json();
  let randomQuoteNum = Math.floor(Math.random() * (data.length) + 1);
  quote.textContent = `"${data[randomQuoteNum].text}"`;
  author.textContent = data[randomQuoteNum].author;
}

changeQuote.addEventListener('click', getQuotes);

//Audio Player
audio.currentTime = 0;
audio.src = playList[playNum].src;

function updatePlayButton() {
  if (audio.paused) {
    playAudioButton.classList.remove('pause');
  } else {
    playAudioButton.classList.add('pause');    
  } 

  playItems.forEach(function callback(li, index) {
    if (index === playNum && !audio.paused) {
      li.classList.add('pause');
    } else {
      li.classList.remove('pause');
    }
  });

}

function toggleAudio() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function playAudio() {
  audio.play();
}

function handleTrackInfo() {
  playerTrackInfo.textContent = playList[playNum].title;
}

function playPrev() {
  playItems[playNum].classList.remove('item-active');
  if (playNum === 0) {
    playNum = playList.length - 1;
  } else {
    playNum--;
  }
  playItems[playNum].classList.add('item-active');
  audio.src = playList[playNum].src;
  playAudio();
  handleTrackInfo()
}

function playNext() {
  playItems[playNum].classList.remove('item-active');
  if (playNum === playList.length - 1) {
    playNum = 0;
  } else {
    playNum++;
  }
  playItems[playNum].classList.add('item-active');
  audio.src = playList[playNum].src;
  playAudio();
  handleTrackInfo()
}

function playByClick() {
  if (this.classList.contains('item-active')) {
    toggleAudio();
  } else {
    playItems[playNum].classList.remove('item-active');
    this.classList.add('item-active');
    playItems.forEach(function callback(item, index) {
      if (item.classList.contains('item-active')) {
        playNum = index;
        audio.src = playList[playNum].src;
        playAudio();
        handleTrackInfo()
      }
    })
  }
}



function handleVolumeUpdate() {
  audio.volume = volume.value / 100;
  volume.style.background = `linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ${volume.value}%, rgba(255, 255, 255, .4) ${volume.value}%, rgba(255, 255, 255, .4) 100%)`
  handleMuteIcon();
}

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds/60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes/60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

function handleProgress() {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = percent;
  progressBar.style.background = `linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) ${percent}%, rgba(255, 255, 255, .4) ${percent}%, rgba(255, 255, 255, .4) 100%)`

  if (audio.currentTime) {
    playerTimeInfo.textContent = getTimeCodeFromNum(audio.currentTime) + " / " + getTimeCodeFromNum(audio.duration);
  }
}

function scrub() {
  const scrubTime = progressBar.value * audio.duration / 100;
  audio.currentTime = scrubTime;
}

function toggleMute() {
  if (audio.volume > 0) {
    volumeValue = audio.volume;
    audio.volume = 0;
    volume.value = 0
    handleVolumeUpdate()
  } else {
    audio.volume = volumeValue;
    volume.value = audio.volume * 100;
    handleVolumeUpdate()
  }
}

function handleMuteIcon() {
  if (audio.volume === 0) {
    mute.classList.add('muted');
  } else {
    mute.classList.remove('muted');
  }
}

playAudioButton.addEventListener('click', toggleAudio);
playPrevButton.addEventListener('click', playPrev);
playNextButton.addEventListener('click', playNext);
audio.addEventListener('play', updatePlayButton);
audio.addEventListener('pause', updatePlayButton);
audio.addEventListener('timeupdate', handleProgress);
audio.addEventListener('ended', playNext);
volume.addEventListener('change', handleVolumeUpdate);
volume.addEventListener('mousemove', handleVolumeUpdate);
progressBar.addEventListener('input', scrub);
playItems.forEach((item) => item.addEventListener('click', playByClick));
mute.addEventListener('click', toggleMute);


//Translation

i18next.init({
  lng: 'en',
  debug: false,
  resources: {
    en: {
      translation: {
        "lng": "en",
        "locale": "en-US",
        "name-placeholder": "[Enter name]",
        "city-placeholder": "Minsk",
        "wind speed": "Wind Speed",
        "m-s": "m/s",
        "humidity": "Humidity",
        "good afternoon": "Good Afternoon",
        "good morning": "Good Morning",
        "good evening": "Good Evening",
        "good night": "Good Night",
        "Language": "Language",
        "Image source": "Image source",
        "Tags for background": "Tags for background",
        "Show time": "Show time",
        "Show date": "Show date",
        "Show greeting": "Show greeting",
        "Show quote of the day": "Show quote of the day",
        "Show weather forecast": "Show weather forecast",
        "Show audio player": "Show audio player"        
      }
    },
    ru: {
      translation: {
        "lng": "ru",
        "locale": "ru-RU",
        "name-placeholder": "[Введите имя]",
        "city-placeholder": "Минск",
        "wind speed": "Скорость ветра",
        "m-s": "м/с",
        "humidity": "Влажность",
        "good afternoon": "Добрый день",
        "good morning": "Доброе утро",
        "good evening": "Добрый вечер",
        "good night": "Спокойной ночи",
        "Language": "Язык приложения",
        "Image source": "Источник изображений",
        "Tags for background": "Теги для изображений",
        "Show time": "Показывать время",
        "Show date": "Показывать дату",
        "Show greeting": "Показывать приветствие",
        "Show quote of the day": "Показывать цитату дня",
        "Show weather forecast": "Показывать прогноз погоды",
        "Show audio player": "Показывать аудио плеер",
      }
    }
  }
});

function changeSiteLanguage() {
  i18next.changeLanguage(language.value, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    t('key'); 
  });
  updateLanguageStrings();
}

function updateSettingsTranslations() {
  document.querySelector('.label-language').textContent = `${i18next.t('Language')}:`;
  document.querySelector('.label-image').textContent = `${i18next.t('Image source')}:`;
  document.querySelector('.label-tags').textContent = `${i18next.t('Tags for background')}:`;
  document.querySelector('.time-span').textContent = `${i18next.t('Show time')}:`;
  document.querySelector('.date-span').textContent = `${i18next.t('Show date')}:`;
  document.querySelector('.greeting-span').textContent = `${i18next.t('Show greeting')}:`;
  document.querySelector('.quote-span').textContent = `${i18next.t('Show quote of the day')}:`;
  document.querySelector('.weather-span').textContent = `${i18next.t('Show weather forecast')}:`;
  document.querySelector('.player-span').textContent = `${i18next.t('Show audio player')}:`;
}

function updateLanguageStrings() {
  updatePlaceholders();
  getWeather();
  getQuotes();
  createToDo('ru');
  updateSettingsTranslations()
}

language.addEventListener('change', changeSiteLanguage);



//Hide and show settings

function hideAndShowElements() {
  timeCheckboxInput.checked ? document.querySelector('.time').classList.remove("hidden") : document.querySelector('.time').classList.add("hidden");
  dateCheckboxInput.checked ? document.querySelector('.date').classList.remove("hidden") : document.querySelector('.date').classList.add("hidden");
  greetingCheckboxInput.checked ? document.querySelector('.greeting-container').classList.remove("hidden") : document.querySelector('.greeting-container').classList.add("hidden");
  quoteCheckboxInput.checked ? document.querySelector('.quote-container').classList.remove("hidden") : document.querySelector('.quote-container').classList.add("hidden");
  weatherCheckboxInput.checked ? document.querySelector('.weather').classList.remove("hidden") : document.querySelector('.weather').classList.add("hidden");
  playerCheckboxInput.checked ? document.querySelector('.player').classList.remove("hidden") : document.querySelector('.player').classList.add("hidden");
}

function toggleSettings() {
  settingsContainer.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
}

settingsContainer.addEventListener('click', hideAndShowElements);
settingsBtn.addEventListener('click', toggleSettings);
overlay.addEventListener('click', toggleSettings);


audio.volume = 0.5;
showTime();
getRandomNum();
setBg();
window.addEventListener('load', getWeather);
getQuotes();
handleTrackInfo()

let placeholderText;
let buttonChangeText;
let buttonDeleteText;

let count=0
 const createToDo = (lang) => {
  const name = {
    en: "ToDo",
    ru: "Дела"
  };
  const title = {
    en: "ToDo List",
    ru: "Список дел"
  };
  const button = {
    en: "New ToDo",
    ru: "Добавить дело"
  };
  const placeholderLan = {
    en: "New ToDo",
    ru: "Добавить дело"
  };
  const changeLan = {
    en: "Change",
    ru: "Изменить"
  };
  const deleteLan = {
    en: "Delete",
    ru: "Удалить"
  };

  if (count%2===0){
      lang='en'
  }

  document.querySelector('.todolist-name').textContent = name[lang];
  document.querySelector('.todo-title').textContent = title[lang];
  document.querySelector('.todo-button').textContent = button[lang];
  placeholderText = placeholderLan[lang];
  buttonChangeText = changeLan[lang];
  buttonDeleteText = deleteLan[lang];
  if (document.querySelector('.todo-input')) {
    document.querySelector('.todo-input').placeholder = placeholderText;
  }
  if (document.querySelector('.todo-change-button')) {
    const buttonList = document.querySelectorAll('.todo-change-button');
    buttonList.forEach(elem => {
      elem.textContent = buttonChangeText;
    })
  }
  if (document.querySelector('.todo-delete-button')) {
    const buttonList = document.querySelectorAll('.todo-delete-button');
    buttonList.forEach(elem => {
      elem.textContent = buttonDeleteText;
    })
  }
  const inputToDO = document.createElement('input');
  inputToDO.classList.add('todo-input');
  inputToDO.placeholder = placeholderText;
  document.querySelector('.todolist-container').append(inputToDO);
  inputToDO.classList.add('hidden');
  count++
}

const addToDoButtonClickHandler = () => {
  document.querySelector('.todo-button').addEventListener('click', buttonHidden);
}

const buttonHidden = () => {
  document.querySelector('.todo-input').classList.remove('hidden');
  addNewToDoChangeHandler();
  document.querySelector('.todo-button').classList.add('hidden');
}

const addNewToDoChangeHandler = () => {
  document.querySelector('.todo-input').addEventListener('change', func);
}

const func = () => {
  addToDOToList();
  changeToDo();
  deleteToDo();
}

const addToDOToList = () => {
  const div = document.createElement('div');
  div.classList.add('todo');
  const contain = document.createElement('p');
  contain.classList.add('todo-text');
  const buttonChange = document.createElement('button');
  const buttonDelete = document.createElement('button');
  buttonChange.classList.add('todo-change-button');
  buttonChange.classList.add('create-button');
  buttonDelete.classList.add('todo-delete-button');
  buttonDelete.classList.add('create-button');
  contain.textContent = document.querySelector('.todo-input').value;
  document.querySelector('.todo-input').value = '';
  buttonChange.textContent = buttonChangeText;
  buttonDelete.textContent = buttonDeleteText;
  div.append(contain);
  div.append(buttonChange);
  div.append(buttonDelete);
  document.querySelector('.todolist-list').append(div);
}

const changeToDo = () => {
  let toDoAll = document.querySelectorAll('.todo');
  const toDoList = toDoAll[toDoAll.length - 1]
  toDoList.querySelector('.todo-change-button').addEventListener('click', changeFunction);
}

const changeFunction = (e) => {
  e.target.removeEventListener('click', changeFunction);
  const todo = e.target.closest('.todo');
  todo.querySelector('.todo-text').classList.add('hidden');
  const changeInput = document.createElement('input');
  changeInput.classList.add('change-input');
  changeInput.value = todo.querySelector('.todo-text').textContent;
  todo.prepend(changeInput);
  todo.querySelector('.change-input').addEventListener('change', () => {
    todo.querySelector('.todo-text').textContent = changeInput.value;
    todo.querySelector('.change-input').remove();
    todo.querySelector('.todo-text').classList.remove('hidden');
    e.target.addEventListener('click', changeFunction);
  })
}

const changeToDoAfterLS = () => {
  const toDoAll = document.querySelectorAll('.todo');
  toDoAll.forEach(elem => {
    elem.querySelector('.todo-change-button').addEventListener('click', changeFunction)
  })
}

const deleteToDo = () => {
  let toDoAll = document.querySelectorAll('.todo');
  const toDoList = toDoAll[toDoAll.length - 1]
  toDoList.querySelector('.todo-delete-button').addEventListener('click', () => {
    toDoList.remove();
    if (document.querySelector('.todolist-list').children.length === 0) {
      document.querySelector('.todo-input').classList.add('hidden');
      document.querySelector('.todo-button').classList.remove('hidden');
    }
  })
}

const deleteToDoAfterLS = () => {
  const toDoAll = document.querySelectorAll('.todo');
  toDoAll.forEach(elem => {
    elem.querySelector('.todo-delete-button').addEventListener('click', () => {
      elem.remove();
      if (document.querySelector('.todolist-list').children.length === 0) {
        document.querySelector('.todo-input').removeEventListener('change', func);
        document.querySelector('.todo-input').classList.add('hidden');
        document.querySelector('.todo-button').classList.remove('hidden');
      }
    })
  })
}

const getToDoFromLocalStorage = () => {
  if(localStorage.getItem('toDoButton')) {
    document.querySelector('.todo-button').classList.value = localStorage.getItem('toDoButton');
  }

  if(localStorage.getItem('toDoContainerClass')) {
    document.querySelector('.todolist-container').classList.value = localStorage.getItem('toDoContainerClass');
  }
  if(localStorage.getItem('toDoContainer')) {
    document.querySelector('.todolist-container').innerHTML = localStorage.getItem('toDoContainer');
    if (document.querySelector('.todo')) {
      changeToDoAfterLS();
      deleteToDoAfterLS();
      addNewToDoChangeHandler();
    }
  }
  if(localStorage.getItem('toDoInput')) {
    document.querySelector('.todo-input').classList.value = localStorage.getItem('toDoInput');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getToDoFromLocalStorage();
});

window.onload = function() {
  renderToDoList();
  document.querySelector('.todolist').addEventListener('click', (e) => {
    if (e.target.classList.value === 'todolist-name') {
      document.querySelector('.todolist-container').classList.toggle('visibility');
    }
  })
}

const renderToDoList = () => {
  createToDo('en');
  addToDoButtonClickHandler();
}
