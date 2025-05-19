const ACCESS_KEY = 'qE-V_BFhmchBlnK-GgFJ0deQZ_reSLHHBTZ-b5MsDpA';
const DEFAULT_QUERY = 'summer';
const defaultUrl = `https://api.unsplash.com/search/photos?query=${DEFAULT_QUERY}&per_page=30&client_id=${ACCESS_KEY}`

const gallery = document.querySelector('main');
const columns = document.querySelectorAll('.gallery__column');
const searchIcon = document.querySelector('.search__icon');
const clearIcon = document.querySelector('.search__clear');
const search = document.querySelector('.search__field');
const columnsCount = window.innerWidth >= 1280 ? 3 : window.innerWidth < 768 ? 1 : 2;


function searchKeyHandler(e) {
  if (e.key === 'Enter' && search.value !== null) {
    const url = `https://api.unsplash.com/search/photos?query=${search.value}&per_page=30&client_id=${ACCESS_KEY}`;
    getData(url);
  }

  if (search.value !== null) {
    if (!clearIcon.classList.contains('search__clear--visible')) {
      clearIcon.classList.add('search__clear--visible');
    }
  } else {
    clearIcon.classList.remove('search__clear--visible');
  }
}

function clearSearchHandler() {
  search.value = '';
  clearIcon.classList.remove('search__clear--visible');
  search.focus();
}
searchIcon.addEventListener('click', () => {
  search.focus();
});

search.addEventListener('keypress', searchKeyHandler);
clearIcon.addEventListener('click', clearSearchHandler);
search.addEventListener('keydown', function (event) {
  const key = event.key;
  if ((key === "Backspace" || key === "Delete") && search.value == '') {
    clearIcon.classList.remove('search__clear--visible');
  }
});


function clearGallery() {
  if (document.querySelector('.gallery--empty') !== null) {
    document.querySelector('.gallery--empty').remove();
  };
  columns.forEach(column => {
    column.innerHTML = '';
  })
}

function createImageCard(data) {
  const cardLink = document.createElement('a');
  cardLink.href = data.links.html;

  const card = document.createElement('figure');
  card.classList.add('img-card');
  card.append(cardLink);

  const img = document.createElement('img');
  img.classList.add('img-card__img');
  img.src = data.urls.small;
  img.alt = data.description;
  cardLink.append(img);

  const layout = document.createElement('div');
  layout.classList.add('img-card__layout');

  const caption = document.createElement('figcaption');
  caption.classList.add('img-card__caption');
  caption.innerHTML = `Photo by <a href="${data.user.links.html}">${data.user.name}</a> on <a href="https://unsplash.com/">Unsplash</a>.`;

  layout.append(caption);
  card.append(layout);
  return card;
}

function drawImages(data) {
  clearGallery();
  data.forEach((element, i) => {
    columns[i % columnsCount].append(createImageCard(element));
  });
}

function drawEmptyGallery() {
  clearGallery();
  const messageOfEmptyness = document.createElement('p');
  messageOfEmptyness.classList.add('gallery--empty');
  messageOfEmptyness.innerText = 'Sorry, no images to show. Try another request.';
  gallery.append(messageOfEmptyness);
}

async function getData(url = defaultUrl) {
  const res = await fetch(url);
  const data = await res.json();
  if (data === undefined) {
    drawEmptyGallery();
  }
  drawImages(data.results);
}

getData();