REST API backend for TenantTrails, a tenant review platform built for CSCI 4177/5709 (Lab 5 & 6) at Dalhousie University.

Built with Node.js and Express, connected to a MySQL database. Features include:
- JWT authentication via httpOnly cookies (signup, login, logout)
- Protected routes using custom auth middleware
- Apartment listings with average ratings and review counts
- CRUD operations for reviews and comments (owner-only edit/delete)
- Image uploads to Cloudinary CDN via Multer
- Automated API tests with Jest and Supertest
- Environment-based configuration via dotenv

Tech stack: Node.js, Express, MySQL2, bcrypt, jsonwebtoken, Multer, Cloudinary, Jest, Supertest
