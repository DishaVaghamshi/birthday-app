# Birthday Web Application

This is a simple birthday web application built with React for the client-side and Node.js for the server-side. The application features virtual candles that can be blown out by clicking or pressing a key, animated fireworks after the candles are blown, a background birthday song that plays after the candles are blown, and a final animated "Happy Birthday" message.

## Client-Side

### Project Structure

```
client
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── App.js
│   ├── App.css
│   ├── birthday.mp3
│   ├── family.jpg
│   ├── components
│   │   ├── Cake.js
│   │   ├── Fireworks.js
│   │   └── BirthdayMessage.js
│   └── index.js
└── package.json
```

### Installation

1. Navigate to the `client` directory:
   ```
   cd client
   ```

2. Install the dependencies:
   ```
   npm install
   ```

### Running the Application

To start the React application, run:
```
npm start
```

This will start the development server and open the application in your default web browser.

## Server-Side

### Project Structure

```
server
├── index.js
├── routes
│   └── index.js
├── controllers
│   └── birthdayController.js
└── README.md
```

### Installation

1. Navigate to the root directory:
   ```
   cd ..
   ```

2. Install the dependencies for the server:
   ```
   npm install
   ```

### Running the Server

To start the Node.js server, run:
```
node server/index.js
```

## Features

- **Virtual Candles**: Click on the cake to blow out the candles.
- **Fireworks Animation**: Enjoy animated fireworks after blowing out the candles.
- **Background Music**: A birthday song plays in the background once the candles are blown out.
- **Animated Birthday Message**: A "Happy Birthday" message is displayed after the candles are blown out.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.

## License

This project is open-source and available under the MIT License.