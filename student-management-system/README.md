# Student Management System

## Project Overview
A small web app for a fictional university. It lets you add, search, edit and delete students, record courses and grades, and calculate GPA. Data is saved in the browser, so no server is needed.

## Features
- Dashboard with total students, average GPA, highest GPA and total courses
- Recent students and a program overview
- Add, edit, delete and search students (with validation)
- Student profiles with courses and calculated GPA
- Toast messages and a delete confirmation modal
- Sorting, colored GPA chips, and a live "what if" GPA preview when adding a course
- Sample data on first visit, empty states, responsive layout

## Technologies
HTML, CSS, JavaScript, localStorage

## How It Works
- `index.html` holds every page as a `<section>`; JavaScript shows one at a time.
- `css/style.css` handles layout, colors and the mobile menu.
- `assets/campus.svg` is the faint line drawing in the page background.
- `js/gpa.js` holds the grade scale and `calculateGPA()`.
- `js/app.js` handles data, saving to localStorage, drawing tables and forms, and button clicks.
- Students are stored as an array of objects, saved with `JSON.stringify()` and loaded with `JSON.parse()`.

To run it, open `index.html` in a browser. To reset the data, clear the site's localStorage in the browser dev tools.

## What I Learned
Arrays and objects, handling form input, DOM manipulation, localStorage, writing reusable functions, GPA calculation and responsive CSS.

## Future Improvements
These are ideas only and are NOT part of the current project:
- Backend database
- User authentication
- REST API
- Real university database
- CSV export
- Advanced analytics
