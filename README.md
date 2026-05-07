# KaviosPix

KaviosPix is an API‑based image management system with secure Google OAuth authentication. Users can create albums, share them via email, and upload images with metadata like tags, comments, favorites, and person names. Uploads are restricted to image files with a 5 MB size limit for reliability.

## Demo Link
[Live Demo](https://kaviospix-rosy.vercel.app/)

## Quick Start

```
git clone "https://github.com/vickykumar3510/KaviosPix_Frontend.git"
cd <KaviosPix_Frontend>
npm install
npm start
```

## Technologies
 * React JS
 * React Router
 * Axios
 * Node.js
 * Express.js
 * Multer
 * JWT
 * UUID
 * MongoDB
 * Google OAuth

## Demo Video
Watch a walkthrough of all the major features of this app: [Google Drive Link](https://drive.google.com/file/d/1DWcsQ69xXiW89opzDD4ltMHo0tHJ4POx/view?usp=sharing)

## Features

**Login Page**
- Google OAuth login button provided for secure sign‑in
- Brand name and logo displayed on the login card
- Clear headline welcoming users to KaviosPix
- Terms & Privacy Policy link shown below the login form

**Dashbord**
- Album creation form provided with name and description fields
- Albums can be updated with new descriptions directly from the dashboard
- Share albums with registered users via email selection dropdown
- Shared users are displayed as chips inside each album card
- Albums can be deleted with a single click from the dashboard
- Error handling and success notifications shown using toast messages
- Navigation integrated with React Router for album detail pages

**Album**
- Upload images directly into albums with validation
- Search images by tags using the filter bar
- View only favorite images with a single click
- Mark or unmark images as favorites from the album view
- Add comments to individual images and display them inline
- Delete images from albums with one click
- Lightbox preview provided for larger image viewing
- Metadata displayed for each image (person, size, upload date, comments, tags)
- Tags shown as chips for quick identification

## API Reference

**GET /auth/google**<br>
Redirects user to Google OAuth login.

**GET /auth/google/callback**<br>
Handles Google OAuth callback, issues JWT token.

**GET /albums**<br>
List of albums (owned or shared).
Sample Response:
```
[{ albumId, name, description, ownerId, sharedWith }]
```

**GET /albums/:albumId/images**<br>
List images in an album (optional tag filter).
Sample Response:
```
[{ imageId, albumId, name, tags, person, isFavorite, comments, sizeMB, uploadedAt }]
```

**GET /kaviosUsers**<br>
List of registered users (excluding current user)<br>
Sample Response:
```
[{ userId, email }]
```

**POST /albums**<br>
Create a new album.<br>
Sample Response:
```
{ albumId, name, description, ownerId, sharedWith }
```

**POST /albums/:albumId/share**<br>
Share album with users by email.

**POST /albums/:albumId/images**<br>
Upload an image file with metadata.
Form Data: file, tags, person, isFavorite

**POST /albums/:albumId/images/:imageId/comments**<br>
Add a comment to an image.

**PUT /albums/:albumId**<br>
Update album description.

**PUT /albums/:albumId/images/:imageId/favorite**<br>
Mark or unmark image as favorite.

**DELETE /albums/:albumId**<br>
Delete album and its images.

**DELETE /albums/:albumId/images/:imageId**<br>
Delete an image from album.


## Contact
For bugs or feature requests, please reach out to vicky.kumar3510@gmail.com