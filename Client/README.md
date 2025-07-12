# SkillSwap Client

A React-based web application for skill swapping platform where users can exchange skills with each other.

## Features

- **User Authentication**: Login and registration
- **Profile Management**: Update profile, skills, and privacy settings
- **Skill Swapping**: Send and manage skill swap requests
- **Social Features**: Add friends, join groups
- **Recommendations**: Get personalized user recommendations
- **Media Upload**: Upload profile photos and other media
- **Responsive Design**: Mobile-friendly interface

## Project Structure

```
src/
├── assets/              # Logos, icons, image assets
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── UserCard.jsx
│   ├── Pagination.jsx
│   └── Toast.jsx
├── context/
│   └── AuthContext.js  # Global authentication context
├── hooks/
│   └── useAuth.js      # Custom auth hook
├── layouts/
│   └── UserLayout.jsx  # Layout with navbar/sidebar
├── pages/              # All route-level pages
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── HomePage.jsx
│   ├── ProfilePage.jsx
│   ├── OtherProfilePage.jsx
│   ├── SwapRequestForm.jsx
│   ├── SwapStatusPage.jsx
│   ├── FriendsPage.jsx
│   ├── GroupPage.jsx
│   ├── CreateGroupPage.jsx
│   ├── GroupDetailPage.jsx
│   ├── RecommendationPage.jsx
│   ├── MediaUploadPage.jsx
│   └── NotFound.jsx
├── services/           # API and client-server services
│   ├── authService.js
│   ├── userService.js
│   ├── swapService.js
│   ├── groupService.js
│   ├── feedbackService.js
│   └── mediaService.js
├── utils/              # Utility functions
│   ├── formatDate.js
│   └── validateFile.js
└── routes/
    └── UserRoutes.jsx
```

## API Integration

The application integrates with the following APIs:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/me` - Get own profile
- `PUT /api/users/me` - Update profile
- `PATCH /api/users/me/privacy` - Set profile privacy
- `PUT /api/users/me/skills` - Update skills
- `GET /api/users` - Get all public users
- `POST /api/users/:id/friend` - Add friend
- `DELETE /api/users/:id/friend` - Remove friend
- `POST /api/users/:id/block` - Block user
- `DELETE /api/users/:id/block` - Unblock user

### Skill Swaps
- `POST /api/swaps` - Send swap request
- `GET /api/swaps/incoming` - Get incoming requests
- `GET /api/swaps/outgoing` - Get outgoing requests
- `POST /api/swaps/:id/accept` - Accept swap request
- `POST /api/swaps/:id/reject` - Reject swap request
- `DELETE /api/swaps/:id/cancel` - Cancel swap request

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get all public groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/leave` - Leave group

### Feedback & Recommendations
- `POST /api/feedback` - Add feedback
- `GET /api/feedback/:userId` - Get user feedback
- `GET /api/recommendations` - Get recommendations

### Media Upload
- `POST /api/upload` - Upload media files

## Technologies Used

- **React 19.1.0** - Frontend framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Configuration

The application expects the backend API to be running on `http://localhost:5000`. You can modify the API base URL in `src/services/authService.js` and other service files.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
