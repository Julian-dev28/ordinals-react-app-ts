# Fractal Bitcoin Ordinals React App

**Explore the live deployment of this App:**
[Fractal Ordinals API Demo](https://fractal-demo-Juliandev28.replit.app)

This boilerplate is an demonstrates interaction with the OKX OS Fractal Bitcoin APIs, offering a seamless and easy-to-use interface for retrieving and managing ordinals data.

## Features

- Access to Fractal Bitcoin Ordinals
- Secure and efficient data handling
- Boilerplate API service

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

4. Start the service:
   - Use the `Run` button provided by Replit to start the API service.
   - Once the server starts, it will give an endpoint URL for accessing the API.

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

4. Start the service:
   ```
   npm start
   ```

This will start the API server. Use [http://localhost:5173](http://localhost:5173) as the base URL for your API requests.

## Project Structure

- `src/server.ts`: The main server entry file
- `src/routes.ts`: Definitions for API routes
- `src/controllers/ordinalsController.ts`: Logic for handling ordinals data requests
- `src/index.css`: Styling for API documentation (if applicable)

## Customization

You can customize the API service by modifying the following:

- API Routes: Edit the route definitions in `src/routes.ts`
- Ordinals logic: Update functions in `src/controllers/ordinalsController.ts`
- Server configuration: Modify settings in `src/server.ts`

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
You can also contact us via the [OKX OS Discord Channel](https://discord.com/channels/1260193012223578164/1267467417848643585).