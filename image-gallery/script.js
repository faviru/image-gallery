const ACCESS_KEY = 'qE-V_BFhmchBlnK-GgFJ0deQZ_reSLHHBTZ-b5MsDpA';
const DEFAULT_QUERY = 'summer';
const columnsCount = window.innerWidth >= 1280 ? 3 : window.innerWidth < 768 ? 1 : 2;
const columnWidth = columnsCount > 1 ? (window.innerWidth - 60 - (30 * (columnsCount - 1))) / columnsCount : window.innerWidth - 60;
const columnHeights = new Array(columnsCount);
columnHeights.fill(0);
let state = {
  totalPages: 0,
  currentPage: 1,
  heights: [...columnHeights],
  search: DEFAULT_QUERY
};
const defaultUrl = `https://api.unsplash.com/search/photos?page=${state.currentPage}&query=${state.search}&per_page=18&client_id=${ACCESS_KEY}`;

const gallery = document.querySelector('main');
const columns = [...document.querySelectorAll('.gallery__column')];
const searchIcon = document.querySelector('.search__icon');
const clearIcon = document.querySelector('.search__clear');
const search = document.querySelector('.search__field');
const loader = document.querySelector('.loader');
const scrollTop = document.querySelector('.scroll-top');

const hideClearIcon = () => {
  clearIcon.classList.remove('search__clear--visible');
};

const showClearIcon = () => {
  clearIcon.classList.add('search__clear--visible');
};

function searchKeyHandler(e) {
  if (e.key === 'Enter' && search.value !== null) {
    state.search = search.value;
    state.currentPage = 1;
    const url = `https://api.unsplash.com/search/photos?page=${state.currentPage}&query=${state.search}&per_page=18&client_id=${ACCESS_KEY}`;
    clearGallery();
    getData(url);
  }

  if (search.value !== null) {
    if (!clearIcon.classList.contains('search__clear--visible')) {
      showClearIcon();
    }
  } else {
    hideClearIcon();
  };
};

function clearSearchHandler() {
  search.value = '';
  clearIcon.classList.remove('search__clear--visible');
  search.focus();
};

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
  });
  state.heights = [...columnHeights];
};

function createImageCard(data) {
  const cardLink = document.createElement('a');
  cardLink.href = data.links.html;

  const card = document.createElement('figure');
  card.classList.add('img-card');
  card.id = data.id;
  card.append(cardLink);

  const img = document.createElement('img');
  img.classList.add('img-card__img');
  img.src = data.urls.small;
  img.alt = data.description !== null ? data.description : data.alt_description;
  cardLink.append(img);

  const topLayout = document.createElement('div');
  topLayout.classList.add('img-card__top-layout');

  const topCaption = document.createElement('figcaption');
  topCaption.classList.add('img-card__caption');
  topCaption.innerHTML = `Liked <span>${data.likes}</span> times.`;
  topLayout.append(topCaption);
  card.append(topLayout);

  const bottomLayout = document.createElement('div');
  bottomLayout.classList.add('img-card__bottom-layout');

  const caption = document.createElement('figcaption');
  caption.classList.add('img-card__caption');
  caption.innerHTML = `Photo by <a href="${data.user.links.html}">${data.user.name}</a> on <a href="https://unsplash.com/">Unsplash</a>.`;

  bottomLayout.append(caption);
  card.append(bottomLayout);
  return card;
}

function drawImages(data) {
  data.forEach(element => {
    const minHeight = Math.min(...state.heights);
    const index = state.heights.indexOf(minHeight);
    columns[index].append(createImageCard(element));
    state.heights[index] += +element.height * columnWidth / +element.width;
  });
};

function drawEmptyGallery() {
  clearGallery();
  const messageOfEmptyness = document.createElement('p');
  messageOfEmptyness.classList.add('gallery--empty');
  messageOfEmptyness.innerText = 'Sorry, no images to show. Try another request.';
  gallery.append(messageOfEmptyness);
};

async function getData(url = defaultUrl) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`An error occurred: ${response.status}`);
  }
  const data = await res.json();
  if (!data) {
    drawEmptyGallery();
  }
  state.totalPages = data.total_pages;
  if (!columns[0].children.length) {
    drawImages(data.results);
  }
};

async function getMoreData(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`An error occurred: ${response.status}`);
  }
  const data = await res.json();
  if (data) {

    drawImages(data.results);
  }
};

const hideLoader = () => {
  loader.classList.remove('loader--loading');
};

const showLoader = () => {
  loader.classList.add('loader--loading');
};

const loadImages = async (url) => {
  showLoader();
  try {
    await getMoreData(url);
  } catch (error) {
    console.log(error.message);
  } finally {
    hideLoader();
  }
};

getData();

function throttle(callee, timeout) {
  let timer = null;
  return function perform(...args) {
    if (timer) return;
    timer = setTimeout(() => {
      callee(...args);
      timer = null
    }, timeout)
  }
}
const throttledUpdateProgress = throttle(scrollHandler, 2000);

const hideScrollTop = () => {
  scrollTop.classList.remove('scroll-top--visible');
};

const showScrollTop = () => {
  scrollTop.classList.add('scroll-top--visible');
};

function scrollHandler() {
  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;
  if (scrollTop > clientHeight) {
    showScrollTop();
  } else {
    hideScrollTop();
  }
  if (scrollTop + clientHeight >= scrollHeight - 60) {
    state.currentPage++;
    const url = `https://api.unsplash.com/search/photos?page=${state.currentPage}&query=${state.search}&per_page=18&client_id=${ACCESS_KEY}`;
    loadImages(url);
  }
}

window.addEventListener('scroll', throttledUpdateProgress, {
  passive: true
});

function scrollTopBtnHandler() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
  hideScrollTop();
}

scrollTop.addEventListener('click', scrollTopBtnHandler)