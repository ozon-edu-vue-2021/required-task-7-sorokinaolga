'use strict';

const templateUser = document.querySelector('#contacts-item');
const usersList = document.querySelector('.contacts-list');

const USERS_LIST_COUNT = 3;
const templateUserDetails = document.querySelector('#contacts-item-details');
const templateListTitle = document.querySelector('#people-list-title');
const templateListItem = document.querySelector('#people-list-item');
const container = document.querySelector('.details-view');
const closeDetails = container.querySelector('.back');

let users = [];
let arrayNameOfUsers = [];
let arrayPopularUsers = [];

const getUsers = () => {
  fetch('../data.json')
    .then(response => response.json())
    .then((data) => {
      renderUsers(data);
      generateData(data);
    });
}

const generateData = (data) => {
  users = data;

  for(let i = 0; i < users.length; i++) {
    arrayNameOfUsers[users[i].id] = users[i].name;
  };

  arrayPopularUsers = data.sort((a, b) => {
    if (b.friends.length === a.friends.length) {
      return a.name.localeCompare(b.name);
    }
    return b.friends.length - a.friends.length;
  });

}

const renderUsers = (list) => {
  if (!list.length) {
      throw Error('Пользователи не найдены');
  }

  const fragment = document.createDocumentFragment();

  list.forEach((element) => {
      const clone = templateUser.content.cloneNode(true);
      const item = clone.querySelector('li');

      item.dataset.id = element.id;

      const name = clone.querySelector('strong');
      name.textContent = element.name;
      fragment.appendChild(clone)
  });

  usersList.appendChild(fragment);
}

const renderDetails = (id) => {
  const user = users.find(item => item.id === id);
  const clone = templateUserDetails.content.cloneNode(true);
  const name = clone.querySelector('.details-view-item');
  name.textContent = user.name;
  const containerList = clone.querySelector('ul');

  const friends = [];
  for(let i = 0; i < USERS_LIST_COUNT; i++) {
    friends.push(users.find(item => item.id === user.friends[i]).name);
  }
  renderListUsers(containerList, friends, 'Друзья');

  const noFriends = [];
  let countNotFriends = 0;
  for(let i = 1; i < arrayNameOfUsers.length; i++) {
    if (!user.friends.includes(i) && user.id !== i) {
      noFriends.push(arrayNameOfUsers[i]);
      countNotFriends++;
    }
    if (countNotFriends >= USERS_LIST_COUNT) {
      break;
    }
  }
  renderListUsers(containerList, noFriends, 'Не в друзьях');

  const popular = [];
  let countPopular = 0;
  for(let i = 0; i < arrayPopularUsers.length; i++) {
    if (arrayPopularUsers[i].id !== user.id) {
      popular.push(arrayPopularUsers[i].name);
      countPopular++;
    }
    if (countPopular >= USERS_LIST_COUNT) {
      break;
    }
  }
  renderListUsers(containerList, popular, 'Популярные люди');

  container.appendChild(clone);
  toggleDetails();
}

const renderListUsers = (container, list, title) => {
  const usersList = templateListTitle.content.cloneNode(true);
  const usersListTitle = usersList.querySelector('li');
  usersListTitle.textContent = title;
  list.forEach((item) => {
    const user = templateListItem.content.cloneNode(true);
    const userName = user.querySelector('span');
    userName.textContent = item;
    usersList.appendChild(user);
  });
  container.appendChild(usersList);
}

const toggleDetails = () => {
  container.classList.toggle('open');
}

const removeDetails = () => {
  toggleDetails();

  const content = container.querySelector('.details-content');
  content.remove();
}

const showDetails = (evt) => {
  const user = evt.target.closest('li');

  if (user) {
    renderDetails(Number(user.dataset.id));
  }
}

usersList.addEventListener('click', showDetails);
closeDetails.addEventListener('click', removeDetails);

getUsers();