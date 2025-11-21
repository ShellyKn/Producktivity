# Producktivity — Backend
Node.js + Express + MongoDB backend

## Tech Stack
- **Node.js** / **Express**
- **MongoDB** (via Mongoose)
- Layered structure (routes, controllers, models; shared config)

## Getting Started

```bash
cd backend
npm install
node index.js
```

Backend will start on the port defined in `.env`.

### Environment Variables

Create a `.env` in `backend/`

- Specify Database details
- Include a port number

## Project Structure

```
backend/
|--index.js                     # Server entry point
|-- config/
|  |-- database.js               # Mongo connection
|-- controllers/
|  |-- follow.controller.js
|  |-- task.controller.js
|  |-- user.controller.js
|-- models/                      # 3 Mongoose models
|  |-- Follow.model.js  
|  |-- Task.model.js 
|  |-- User.model.js              
|-- routes/
|  |-- Follow.routes.js
|  |-- Quotes.routes.js
|  |-- Task.routes.js
|  |-- User.routes.js
```


## Development Notes

- `index.js` loads env, connects to Mongo via `config/database.js`, and mounts the route modules.
- Controllers contain the request handlers; models define schemas; routes wire HTTP verbs to controllers.
