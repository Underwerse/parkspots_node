'use strict';

const API_BASE_URL = 'http://localhost:5000'; // change url when uploading to server

// select existing html elements
const loginForm = document.querySelector('#login-form');
const addUserForm = document.querySelector('#add-user-form');
// document.getElementById('login_link').hidden = false;

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(API_BASE_URL + '/auth/login', fetchOptions);
    const json = await response.json();
    if (json.user) {
      console.log('token: ', json.token);
      sessionStorage.setItem('token', json.token);
      sessionStorage.setItem('user', JSON.stringify(json.user));
      location.href = 'index.html';
    } else {
      alert(json.message);
    }
  } catch (e) {
    console.log(e.message);
  }
});

// submit register form
addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(addUserForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(
    API_BASE_URL + '/auth/registration',
    fetchOptions
  );
  const json = await response.json();
  alert(json.message);
});
