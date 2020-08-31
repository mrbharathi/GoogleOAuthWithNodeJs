# Google OAuth With NodeJs

This web project has code example to authenticate user using Google email/password.
It is a simple Nodejs server file, home page containing a link to login with Google.
Upon clicking the link, standard google login page will be displayed.
Once user authenticates with google id and password, a welcome screen with the name and email is displayed.

Steps:
1. Create google client oauth id
2. Create new nodejs project
3. Install nodejs, googleapis
4. Get login code from query string in redirected route from google
5. Get token from google api using the code from redirected url
6. Get people profile from google endpoint
7. Get Name and Email address from profile

