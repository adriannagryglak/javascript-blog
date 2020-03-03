'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorsListLink: Handlebars.compile(document.querySelector('#template-authors-list-link').innerHTML)
}

const opt = {
  ArticleSelector: '.post',
  TitleSelector: '.post-title',
  TitleListSelector: '.titles',
  ArticleTagsSelector: '.post-tags .list',
  ArticleAuthorSelector: '.post-author',
  TagsListSelector: '.tags.list',
  CloudClassCount: 5,
  CloudClassPrefix: 'tag-size-',
  AuthorsListSelector: '.authors.list',
};

const postssListsTitle = document.getElementById('postsListsTitle');

postsListsTitle.addEventListener('click', function () {
  generateTitleLinks();
  console.log('na nowo wyświetliłem wszystkie linki');
});


function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');


  /* [DONE]find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);


  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
}


function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */

  const titleList = document.querySelector(opt.TitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(opt.ArticleSelector + customSelector);
  let html = '';

  for (let article of articles) {
    const articleId = article.getAttribute('id'); //get the article id
    const articleTitle = article.querySelector(opt.TitleSelector).innerHTML; //find title element get title from element
    const linkHTMLData = {
      id: articleId,
      title: articleTitle
    };
    const linkHTML = templates.articleLink(linkHTMLData); //create html of link

    html = html + linkHTML; //insert link into titleList
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');


  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();



function calculateTagsParams(tags) { // znalezienie najmniejszej i największej liczby wystąpień

  const params = {
    max: '0',
    min: '999999'
  };

  for (let tag in tags) {

    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params; //obiekt z max i min liczbą wystapień tagów
}


function calculateTagClass(count, params) { // (liczba wystapienia konkretnego taga, max i min wszystich tagow)

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opt.CloudClassCount - 1) + 1);

  return opt.CloudClassPrefix + classNumber;
}

function generateTags() {

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.ArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opt.ArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '&nbsp</a></li>';

      const linkHTMLData = {
        id: 'tag-' + tag,
        title: tag
      };
      const linkHTML = templates.articleLink(linkHTMLData);

      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add tag to allTags obcjet */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */

  const tagList = document.querySelector(opt.TagsListSelector);

  const tagsParams = calculateTagsParams(allTags); //w ilu artykułach pojawia się najrzadszy z tagów, a w ilu – najbardziej popularny

  /* [NEW] create variable for all links HTML code */

  const allTagsData = {
    tags: []
  };

  /*[NEW] START LOOP: for each tag in allTags */

  for (let tag in allTags) {

    /*[NEW] generate code of a link and add it to allTagsHTML */


    //const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });;

    /*[NEW] END LOOP: for each tag in allTags*/
  }
  /*[NEW] add html from allTagsHTML to tagList */

  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
}


generateTags();


function tagClickHandler(event) {

  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href ^= "#tag-"]');

  /* START LOOP: for each active tag link */

  for (let activeTagLink of activeTagLinks) {

    /* remove class active */

    activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */

  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href = "' + href + '"]');

  /* START LOOP: for each found tag link */

  for (let tagLink of tagLinks) {

    /* add class active */

    tagLink.classList.add('active');

    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}



function addClickListenersToTags() {

  /* find all links to tags */

  const tagLinks = document.querySelectorAll('a[href ^= "#tag-"]');

  /* START LOOP: for each link */

  for (let tagLink of tagLinks) {

    /* add tagClickHandler as event listener for that link */

    tagLink.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */
  }
}

addClickListenersToTags();



function generateAuthors() {

  /* [NEW] create a new variable allTags with an empty object,will act as our catalog for all links */

  let allAuthors = {};

  const articles = document.querySelectorAll(opt.ArticleSelector);

  for (let article of articles) {

    const authorWrapper = article.querySelector(opt.ArticleAuthorSelector);

    let html = '';

    const author = article.getAttribute('data-author');

    //let linkHTML = '<a href="#author-' + author + '">' + author + '</a>';

    const linkHTMLData = {
      id: 'author-' + author,
      title: author
    };
    const linkHTML = templates.articleLink(linkHTMLData);


    html = html + 'by ' + linkHTML;

    if (!allAuthors.hasOwnProperty(author)) {

      /* [NEW] add tag to allTags obcjet */

      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }

    authorWrapper.innerHTML = html;
  }

  /* insert HTML of all the links into the author wrapper TO JUZ JEST WYZEJ? */
  const authorsList = document.querySelector(opt.AuthorsListSelector);

  let allAuthorsData = {
    authors: []
  };

  /* START LOOP: for each author */

  for (let author in allAuthors) {

    /*[NEW] generate code of a link and add it to allTagsHTML */

    //const authorLinkHTML = '<li><a href="#author-' + author + '">' + author + '</a><span> (' + allAuthors[author] + ')</span></li>';

    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
  }

  authorsList.innerHTML = templates.authorsListLink(allAuthorsData);
}

generateAuthors();



function addClickListenersToAuthors() {

  /* find all links to authors */

  const authorLinks = document.querySelectorAll('a[href ^= "#author-"]');

  /* START LOOP: for each link */

  for (let authorLink of authorLinks) {

    /* add authorClickHandler as event listener for that link */

    authorLink.addEventListener('click', authorClickHandler);

    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();


function authorClickHandler(event) {

  event.preventDefault();

  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const author = href.replace('#author-', '');

  const activeAuthorLinks = document.querySelectorAll('a.active[href ^= "#author-"]');

  for (let activeAuthorLink of activeAuthorLinks) {
    activeAuthorLink.classList.remove('active');
  }

  const authorLinks = document.querySelectorAll('a[href = "' + href + '"]');

  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}
