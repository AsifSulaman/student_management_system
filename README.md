# Student Management System

A small web app for managing students, courses and GPA at a fictional university. Built with plain HTML, CSS and JavaScript to practice core web development skills. No installs, no server, no frameworks.

FOR LIVE DEMO : https://asifsulaman.github.io/student_management_system/

> All names and records are made up. Data is stored only in your own browser.

## Features

- **Dashboard:** total students, average GPA, highest GPA, total courses, recent students and a program overview
- **Students:** add, edit, delete, search (name, ID or email) and sort (newest, name, GPA)
- **Profiles:** personal details, courses, grades and calculated GPA
- **Courses & Grades:** add courses to a student, with a live "what if" GPA preview
- **Polish:** form validation, toast messages, delete confirmation, empty states, colored GPA chips, responsive layout (desktop to mobile)
- **Saved data:** everything survives a page refresh thanks to localStorage

## Technologies

HTML, CSS, vanilla JavaScript, browser localStorage

## Getting Started

1. Download or clone this folder.
2. Open `index.html` by double-clicking it (Chrome, Edge or Firefox).

That is all. Keep the folder structure unchanged, because `index.html` loads files from `css/`, `js/` and `assets/`.

**Tip:** open the folder in VS Code and use the Live Server extension to reload automatically while you edit.

## Project Structure

```
student-management-system/
├── index.html        All pages (each one is a <section>)
├── css/style.css     Colors, layout, responsive rules
├── js/gpa.js         Grade scale and GPA calculation
├── js/app.js         Data, saving, drawing pages, button logic
├── assets/campus.svg Faint background drawing
└── README.md
```

## How It Works

- **Pages:** `index.html` contains every page. JavaScript shows one section at a time.
- **Data:** students are stored as an array of objects. Each student has a name, ID, email, date of birth, program, semester, GPA and a list of courses.
- **Saving:** `JSON.stringify()` turns the array into text for localStorage. `JSON.parse()` turns it back when the page loads.
- **GPA:** `GPA = sum(grade points x credit hours) / total credit hours`

  Example: A, B+ and A- at 3 credits each gives (12 + 9.9 + 11.1) / 9 = **3.67**

| Grade | A | A- | B+ | B | B- | C+ | C | C- | D | F |
|---|---|---|---|---|---|---|---|---|---|---|
| Points | 4.0 | 3.7 | 3.3 | 3.0 | 2.7 | 2.3 | 2.0 | 1.7 | 1.0 | 0.0 |

## Reset the Data

Press F12, open **Application** (Chrome/Edge) or **Storage** (Firefox), choose **Local Storage**, delete the `students` entry, then refresh. The sample students come back.

## What I Learned

- Working with arrays and objects
- Handling user input and validation
- Changing the page with the DOM
- Storing data in the browser
- Writing small reusable functions
- Calculating GPA
- Building a responsive layout

## Future Improvements

Ideas only. These are **not** part of the current project:

- Backend database
- User authentication
- REST API
- Real university database
- CSV export
- Advanced analytics
