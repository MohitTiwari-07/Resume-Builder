# Full-Stack Resume Builder

A modern web application for creating and managing resumes, built with React (TypeScript) and Flask.

## Project Structure

```
resume-builder/
├── frontend/           # React TypeScript frontend
│   ├── src/           # Source files
│   ├── public/        # Static files
│   └── package.json   # Frontend dependencies
└── backend/           # Flask backend
    ├── app.py         # Main Flask application
    └── requirements.txt # Python dependencies
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features
- Modern React frontend with TypeScript
- Flask backend with RESTful API
- CORS enabled for secure cross-origin requests
- Development proxy for seamless API integration

## Technologies Used
- Frontend: React 18, TypeScript, Vite
- Backend: Flask, Python
- API Communication: Axios 