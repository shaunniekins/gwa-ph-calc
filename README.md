# GWA Calculator (Philippines)

A web application that helps students calculate their General Weighted Average (GWA) following the common grading system used in Philippine universities.

## About

The GWA Calculator is designed to help students easily compute their General Weighted Average by entering their subjects, corresponding units, and grades. The calculation follows the standard formula:

### GWA Formula

GWA = Σ (Grade × Units) / Σ Units

## Features

- Add and manage multiple subjects with their respective units and grades
- Drag and drop functionality to reorder subjects
- Automatic calculation of GWA as you add or remove subjects
- Persistent storage using localStorage to save your subject data
- Responsive design that works well on both desktop and mobile devices

## How to Use

1. **Add Subjects**: Enter the subject name, number of units, and your grade in the form
2. **View Your Subjects**: All added subjects will appear in the table below
3. **Rearrange Subjects**: Drag and drop to reorder your subject list
4. **Remove Subjects**: Click the "Remove" button to delete a subject
5. **Check Your GWA**: Your calculated GWA is displayed prominently in the result section

## Technical Details

This application is built with:

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) - Drag and drop library
