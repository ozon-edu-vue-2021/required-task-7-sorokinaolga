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
let arrayNameOfUsers = [null];
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
    arrayNameOfUsers.push(users[i].name);
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
  const list = clone.querySelector('ul');

  const friends = templateListTitle.content.cloneNode(true);
  const friendsTitle = friends.querySelector('li');
  friendsTitle.textContent = 'Друзья';
  for(let i = 0; i < USERS_LIST_COUNT; i++) {
    const item = templateListItem.content.cloneNode(true);
    const friend = item.querySelector('span');
    friend.textContent = users.find(item => item.id === user.friends[i]).name;
    friends.appendChild(item);
  }
  list.appendChild(friends);

  const noFriends = templateListTitle.content.cloneNode(true);
  const noFriendsTitle = noFriends.querySelector('li');
  noFriendsTitle.textContent = 'Не в друзьях';
  let count = 0;
  for(let i = 1; i < arrayNameOfUsers.length; i++) {
    if (!user.friends.includes(i) && user.id !== i) {
      const item = templateListItem.content.cloneNode(true);
      const noFriend = item.querySelector('span');
      noFriend.textContent = arrayNameOfUsers[i];
      noFriends.appendChild(item);
      count++;
    }
    if (count >= USERS_LIST_COUNT) {
      break;
    }
  }
  list.appendChild(noFriends);

  const popular = templateListTitle.content.cloneNode(true);
  const popularTitle = popular.querySelector('li');
  popularTitle.textContent = 'Популярные люди';
  for(let i = 0; i < USERS_LIST_COUNT; i++) {
    const item = templateListItem.content.cloneNode(true);
    const friend = item.querySelector('span');
    friend.textContent = arrayPopularUsers[i].name;
    popular.appendChild(item);
  }
  list.appendChild(popular);

  container.appendChild(clone);
  toggleDetails();
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