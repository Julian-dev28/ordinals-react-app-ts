# Fractal Bitcoin Ordinals React App

This boilerplate is an app that demonstrates interaction with the OKX OS Fractal Bitcoin APIs, offering a seamless and easy-to-use interface for retrieving and managing ordinals data.

## Features

- Access to Fractal Bitcoin Ordinals
- Secure and efficient data handling
- Boilerplate react app

## Technologies Used

- Node.js
- Express
- React

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v20 or later)
- npm (usually comes with Node.js)
- API Crededntials from the [OKX OS Developer Portal](https://www.okx.com/web3/build/dev-portal)

## Set Up

## Using Replit

1. Fork the Repository
   - Click "Use Template" to fork this repl.
   
2. Set up your environment variables (consider using a .env file):
```
OKX_API_KEY=
OKX_API_SECRET=
OKX_API_PASSPHRASE=
```

3. Install the dependencies
   - In Replit, open the shell terminal and run the following command:
```
npm install
```

4. Run the App:
   - Use the `Run` button provided by Replit to start the React app.

## Using GitHub
1. Clone the repository:
```
git clone https://github.com/Julian-dev28/fractal-ordinals-api.git
```

2. Navigate to the project directory:
```
cd fractal-ordinals-api
```

3. Install the dependencies:
```
npm install
```

4. Set up your environment variables (consider using a .env file):
```
OKX_API_KEY=
OKX_API_SECRET=
OKX_API_PASSPHRASE=
```


5. Start the proxy server:
   ```
   node ordinals-server.cjs
   ```

6. In another terminal window, run the app:
   ```
   npm run dev
   ```

This will start the React app. Use [http://localhost:5173](http://localhost:5173) to view the frontend and observer your console to see call/response data.

## Project Structure

- `./ordinals-server.cjs`: The server for the proxy API service
- `./src/components/`: React components for the frontend
- `./src/components/OrdinalsFetcher.tsx`: Component for fetching ordinals data
- `./src/components/RetrieveInscriptions.tsx`: Component for retrieving inscription data 
- `./src/components/TradeHistory.ts`: Component for displaying trade history of a specific ordinal
- `./src/services/okxServices.ts` : Service for interacting with the OKX API


## Customization

You can customize the App service by modifying the following:

- `./ordinals-server.cjs`: Update the API routes and data handling logic
- `./src/components/`: Update the React components to change the frontend behavior
- `./src/services/okxServices.ts`: Update the service methods to change the API interaction logic

## Contributing

Contributions to this project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Fractal for providing the ordinals data
- The Node.js and Express communities for their excellent documentation and support

## Contact

If you have any questions or feedback, please open an issue in this repository.
You can also contact us via the [OKX OS Discord Channel](https://discord.gg/k6Z7VYsF).