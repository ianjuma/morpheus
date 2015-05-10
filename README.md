#### morph

###### Create a .env file:

```bash
POSTGRES_PORT=<POSTGRES_port>
POSTGRES_HOST=localhost
POSTGRES_USERNAME=<POSTGRES_username>
POSTGRES_PASSWORD=<POSTGRES_password>
```

This sets up environment variables that are accessed within node via:
```javascript
process.env.VAR
```

###### Install Dependencies:

Install node dependencies:
```javascript
npm install
```

###### Launch App:

Finally launch the app using:
```javascript

node app

```
