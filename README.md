# Blog API - Full Stack Blogging Platform

A complete full-stack blogging platform with separate interfaces for administrators, users, and readers. Built with Node.js, Express, Prisma, and vanilla JavaScript.

## Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing with bcryptjs
- Input validation with express-validator

### 👥 Multi-Interface Design

- **Admin Dashboard** - Complete site management
- **User Dashboard** - Personal content management
- **Public Blog** - Read-only interface for visitors

### 📝 Content Management

- Create, edit, delete posts
- Publish/unpublish functionality
- Comment system (authenticated and anonymous)
- Search functionality
- Post filtering and sorting

### 🛡️ Security Features

- Rate limiting
- CORS protection
- JWT token expiration
- Input sanitization
- Role-based route protection

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL/SQLite** - Database
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing

### Frontend

- **Vanilla JavaScript** - No framework dependencies
- **HTML5** - Semantic markup
- **CSS3** - Styling (minimal for functionality focus)

## Project Structure

```bash
BLOG-API/
├── admin-frontend/          # Admin dashboard interface
│   └── index.html
├── config/                  # Configuration files
│   └── passport.js         # Passport strategies
├── controllers/             # Business logic
│   ├── commentsController.js
│   └── postsController.js
├── prisma/                  # Database schema and migrations
│   ├── migrations/
│   └── schema.prisma
├── reader-frontend/         # Public blog interface
│   └── index.html
├── routes/                  # API routes
│   ├── auth.js
│   ├── comments.js
│   └── posts.js
├── user-frontend/           # User dashboard interface
│   └── index.html
├── .env                     # Environment variables
├── app.js                   # Main application file
├── package.json             # Dependencies and scripts
└── seed.js                  # Database seeding script
```

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/GraceInCode/blog-api
   cd blog-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="your-database-connection-string"
   JWT_SECRET="your-jwt-secret-key"
   PORT=5000
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Seed the database (optional)**

   ```bash
   node seed.js
   ```

6. **Start the server**

   ```bash
   npm start
   # or for development
   npm run dev
   ```

## Usage

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Posts

- `GET /api/posts` - Get all published posts
- `GET /api/posts/all` - Get all posts (admin only)
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/:id` - Update post (owner/admin)
- `DELETE /api/posts/:id` - Delete post (owner/admin)
- `PUT /api/posts/:id/publish` - Toggle publish status (owner/admin)

#### Comments

- `GET /api/comments` - Get all comments
- `GET /api/comments/:id` - Get specific comment
- `POST /api/posts/:id/comments` - Add comment to post
- `PUT /api/comments/:id` - Update comment (owner/admin)
- `DELETE /api/comments/:id` - Delete comment (owner/admin)

### Frontend Interfaces

#### Admin Dashboard (`/admin-frontend/index.html`)

- Complete site management
- View all posts (published and unpublished)
- Manage any user's content
- Publish/unpublish posts
- Admin-only access

#### User Dashboard (`/user-frontend/index.html`)

- User registration and login
- Create and manage personal posts
- Edit own content
- Publish/unpublish own posts
- View personal post analytics

#### Public Blog (`/reader-frontend/index.html`)

- View published posts
- Read-only interface
- No authentication required
- Clean, simple design

## Database Schema

The application uses the following main entities:

- **User** - User accounts with roles
- **Post** - Blog posts with publish status
- **Comment** - Comments on posts (with optional user association)

See `prisma/schema.prisma` for the complete database schema.

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Database (PostgreSQL recommended, SQLite for development)

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npx prisma studio` - Open Prisma database browser
- `npx prisma migrate dev` - Run database migrations

### Environment Variables

- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)

## Security Considerations

- All passwords are hashed using bcryptjs
- JWT tokens expire after 1 hour
- Rate limiting prevents abuse
- Input validation on all endpoints
- CORS configured for specific origins
- Role-based access control implemented

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
