# COLORS – LAMP Stack Web Application

COLORS is a small web application built with the LAMP stack (Linux, Apache, MySQL, PHP) for the COLORS Lab. A user logs in, adds colors to their own personal list, and searches that list by partial name. This README assumes you have not attended the lab sessions.

## Features

- Log in with a username and password
- Add a color to your personal list
- Search your colors by partial name (server-side `LIKE` search)

## Technologies Used

- Linux (Ubuntu recommended)
- Apache 2
- MySQL (or MariaDB)
- PHP 8 with the `mysqli` extension
- HTML, CSS, and vanilla JavaScript

## Project Structure

```text
colors-lamp/
├── LAMPAPI/
│   ├── AddColor.php          # add a color for a user
│   ├── Login.php             # authenticate a user
│   ├── SearchColors.php      # search a user's colors
│   └── config.example.php    # template for database settings
├── public/
│   ├── index.html            # login page
│   ├── color.html            # add / search colors page
│   ├── css/styles.css
│   ├── js/code.js            # client-side logic
│   ├── js/md5.js
│   └── images/background.png
├── database/
│   └── schema.sql            # table definitions
├── LICENSE.md
└── README.md
```

## Setup

### 1. Install prerequisites (Ubuntu)

```bash
sudo apt update
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql git
```

### 2. Get the code

```bash
git clone https://github.com/trent-y/colors-lamp.git
cd colors-lamp
```

### 3. Create the database

```bash
sudo mysql
```

```sql
CREATE DATABASE colors_db;
CREATE USER 'colors_user'@'localhost' IDENTIFIED BY 'choose_a_password';
GRANT ALL PRIVILEGES ON colors_db.* TO 'colors_user'@'localhost';
EXIT;
```

Create the tables:

```bash
sudo mysql colors_db < database/schema.sql
```

### 4. Add a demo user

The application has no registration page, so add a user manually:

```bash
sudo mysql colors_db -e "INSERT INTO Users (firstName, lastName, Login, Password) VALUES ('Demo', 'User', 'demo', 'demo-password');"
```

### 5. Configure database credentials

```bash
cp LAMPAPI/config.example.php LAMPAPI/config.php
```

Edit `LAMPAPI/config.php` and enter the database name, user, and password from step 3. This file is git-ignored and must never be committed.

### 6. Deploy to Apache

Copy the site and the API into Apache's web root so that `LAMPAPI/` sits next to `index.html`:

```bash
sudo cp -r public/* /var/www/html/
sudo cp -r LAMPAPI /var/www/html/
sudo systemctl restart apache2
```

## Running and Accessing the Application

Open `http://localhost/` in a browser (or `http://<server-ip>/` if it runs on another machine). Log in with the demo user (`demo` / `demo-password`), add a few colors, and use the search box to find them by partial name.

## API Endpoints

All endpoints accept and return JSON via `POST` and live under `/LAMPAPI/`.

| Endpoint | Request body | Purpose |
|---|---|---|
| `Login.php` | `login`, `password` | Returns the user's `id`, `firstName`, `lastName` |
| `AddColor.php` | `userId`, `color` | Adds a color to the user's list |
| `SearchColors.php` | `userId`, `search` | Returns colors whose name contains the search text |

## Assumptions and Limitations

- Assumes an Ubuntu machine with Apache, MySQL, and PHP available.
- `LAMPAPI/` must sit next to `index.html` in the web root because the JavaScript calls the API at `/LAMPAPI`.
- No registration page; users must be added to the database manually.
- Passwords are sent to the server and stored in plain text. `md5.js` is included, but the hashing calls in `code.js` are commented out. This is not safe for real-world use.
- The API trusts the `userId` sent by the client and has no session or token checks.
- JSON responses are built by string concatenation, so special characters (such as quotes) in names could break the output.
- Search results are inserted into the page with `innerHTML` without escaping, so a color name containing HTML would be rendered as markup.
- `AddColor.php` reports success even if the insert fails.
- Database queries use prepared statements, which protects against SQL injection.

## License

Released under the MIT License. See [LICENSE.md](LICENSE.md).
