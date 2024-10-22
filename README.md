# HostYourHTML

host an html just because you can. 

## Overview
**hostyourhtml** is a simple, open-source HTML hosting service built with Node.js and Firebase. it allows users to create, edit, delete, and search for HTML pages through a few basic API endpoints. the project is designed to be straightforward, with a minimal frontend and no styling.

## Features
- **create HTML:** users can create and host raw HTML pages.
- **edit HTML:** modify hosted HTML content using an edit key.
- **delete HTML:** delete HTML pages using an edit key.
- **search HTML:** search across all hosted HTMLs for a specific query.

## API Endpoints

### 1. **Create HTML**
- **Endpoint:** `/api/makeyourhtml`
- **Method:** `POST`
- **Body:** `{ "html": "<your-html-content>" }`
- **Response:** `{ "link": "hostyourhtml.vercel.app/html/<id>", "editKey": "<edit-key>" }`

### 2. **Edit HTML**
- **Endpoint:** `/api/edityourhtml`
- **Method:** `PUT`
- **Body:** `{ "id": "<id>", "editKey": "<edit-key>", "html": "<updated-html>" }`
- **Response:** `{ "success": true, "message": "HTML updated successfully" }`

### 3. **Delete HTML**
- **Endpoint:** `/api/deleteyourhtml`
- **Method:** `DELETE`
- **Body:** `{ "id": "<id>", "editKey": "<edit-key>" }`
- **Response:** `{ "success": true, "message": "HTML deleted successfully" }`

### 4. **Search HTML**
- **Endpoint:** `/api/searchthehtmls`
- **Method:** `GET`
- **Query:** `?query=<search-query>`
- **Response:** `{ "results": [ { "id": "<id>", "html": "<html-content>" } ] }`
