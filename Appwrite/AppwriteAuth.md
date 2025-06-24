# Complete Appwrite Authentication Setup Guide for React.js

A comprehensive guide to set up Appwrite authentication with both Email/Password and Google OAuth2 in React.js applications.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Appwrite Cloud Setup](#appwrite-cloud-setup)
3. [Google Cloud Console Setup](#google-cloud-console-setup)
4. [React.js Integration](#reactjs-integration)
5. [Testing Authentication](#testing-authentication)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## Prerequisites

- Node.js 16+ installed
- React.js project set up (Vite recommended)
- Google account for Google Cloud Console
- Basic understanding of React hooks and context

---

## Appwrite Cloud Setup

### 1. Create Appwrite Account

1. Visit [cloud.appwrite.io](https://cloud.appwrite.io)
2. Click **"Sign Up"** and create your account
3. Verify your email address
4. Complete the onboarding process

### 2. Create New Project

1. Click **"Create Project"** on the dashboard
2. Enter project details:
   - **Name**: Your app name (e.g., "MyApp")
   - **Project ID**: Auto-generated (you can customize)
3. Click **"Create"**
4. **Important**: Copy and save your **Project ID** - you'll need this later

### 3. Configure Platform

1. In your project dashboard, go to **"Settings"** > **"Platforms"**
2. Click **"Add Platform"** > **"Web App"**
3. Enter platform details:
   - **Name**: "Web App" (or any name)
   - **Hostname**: `localhost` (for development)
   - **Port**: `5173` (default Vite port)
4. Click **"Next"** and **"Skip optional steps"**

### 4. Enable Email/Password Authentication

1. Navigate to **"Auth"** > **"Settings"**
2. Scroll to **"Auth Methods"** section
3. Find **"Email/Password"** and toggle it **ON**
4. Configure settings:
   - **Session Length**: 31536000 (1 year) or your preference
   - **Password History**: 0 (or your preference)
   - **Password Dictionary**: Enable if desired
5. Click **"Update"**

### 5. Enable Google OAuth2

1. In the same **"Auth"** > **"Settings"** page
2. Scroll to **"OAuth2 Providers"** section
3. Find **"Google"** and click on it
4. Toggle **"Google"** to **ON**
5. **Don't fill the credentials yet** - we'll get them from Google Cloud Console

---

## Google Cloud Console Setup

### 1. Create/Select Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Sign in with your Google account
3. Either:
   - **Create new project**: Click project dropdown > "New Project" > Enter name > "Create"
   - **Select existing project**: Click project dropdown > Select your project

### 2. Enable Required APIs

1. Go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**
4. Wait for the API to be enabled

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Choose **"External"** user type (unless you have Google Workspace)
3. Click **"Create"**
4. Fill in required information:
   - **App name**: Your application name
   - **User support email**: Your email
   - **App logo**: Upload your app logo (optional)
   - **App domain**: Your website domain (for production)
   - **Authorized domains**: Add your domains
     - For development: `localhost`
     - For production: `yourdomain.com`
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. **Scopes**: Click **"Save and Continue"** (default scopes are fine)
7. **Test users**: Add test emails if needed, then **"Save and Continue"**
8. **Summary**: Review and click **"Back to Dashboard"**

### 4. Create OAuth2 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth 2.0 Client IDs"**
3. Choose **"Web application"**
4. Configure the OAuth client:
   - **Name**: "Web Client" (or any name)
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     https://yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/[YOUR_PROJECT_ID]
     ```
     _(Replace [YOUR_PROJECT_ID] with your actual Appwrite project ID)_
5. Click **"Create"**
6. **Copy the Client ID and Client Secret** - you'll need these for Appwrite

### 5. Complete Appwrite Google OAuth2 Setup

1. Go back to your Appwrite project
2. Navigate to **"Auth"** > **"Settings"** > **"OAuth2 Providers"** > **"Google"**
3. Fill in the credentials:
   - **App ID**: Paste your Google **Client ID**
   - **App Secret**: Paste your Google **Client Secret**
4. Set redirect URLs:
   - **Success URL**: `http://localhost:5173/dashboard`
   - **Failure URL**: `http://localhost:5173/login`
5. Click **"Update"**

---

## React.js Integration

### 1. Install Dependencies

```bash
npm install appwrite react-hot-toast
```

### 2. Environment Configuration

Create `.env` file in your project root:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_actual_project_id_here
```

**Important**: Replace `your_actual_project_id_here` with your real Appwrite Project ID.

### 3. Create Appwrite Configuration

Create `src/config/appwrite.js`:

```javascript
import { Client, Account, OAuthProvider } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Initialize Account service
export const account = new Account(client);

// Export OAuth providers
export const oauth = {
  google: OAuthProvider.Google,
  github: OAuthProvider.Github,
  facebook: OAuthProvider.Facebook,
};

export { client };
export default client;
```

### 4. Create Authentication Context

Create `src/contexts/AuthContext.jsx`:

```javascript
import React, { createContext, useContext, useEffect, useState } from "react";
import { account, oauth } from "../config/appwrite.js";
import { ID } from "appwrite";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Login
  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Email/Password Signup
  const signup = async (name, email, password) => {
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Google OAuth2 Login
  const signInWithGoogle = async () => {
    try {
      await account.createOAuth2Session(
        oauth.google,
        `${window.location.origin}/dashboard`, // Success redirect
        `${window.location.origin}/login` // Failure redirect
      );
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null); // Clear user state anyway
    }
  };

  const value = {
    user,
    login,
    signup,
    signInWithGoogle,
    logout,
    loading,
    isAuthenticated: !!user,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 5. Create Login Component

Create `src/components/Login.jsx`:

```javascript
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // Redirect will be handled by your router
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // OAuth redirect will handle navigation
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* Email/Password Form */}
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Google OAuth2 Button */}
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
```

### 6. Wrap App with AuthProvider

Update your `src/App.jsx`:

```javascript
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

---

## Testing Authentication

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Email/Password Authentication

1. Navigate to `http://localhost:5173/login`
2. Try signing up with a new email and password
3. Try logging in with the created credentials
4. Check if you're redirected to the dashboard

### 3. Test Google OAuth2

1. Click the "Sign in with Google" button
2. You should be redirected to Google's consent screen
3. Grant permissions
4. You should be redirected back to your dashboard

### 4. Test Session Persistence

1. Refresh the page while logged in
2. You should remain logged in
3. Test logout functionality

## Troubleshooting

### Common Issues and Solutions

#### 1. "Project not found" Error

**Problem**: Getting project not found error when trying to authenticate.

**Solutions**:

- Double-check your Project ID in the `.env` file
- Ensure there are no extra spaces or characters in the Project ID
- Verify the endpoint URL is correct
- Restart your development server after changing `.env`

#### 2. Google OAuth2 "redirect_uri_mismatch" Error

**Problem**: Google shows redirect URI mismatch error.

**Solutions**:

- Verify the redirect URI in Google Cloud Console exactly matches what Appwrite shows
- Check for typos, extra spaces, or missing characters
- Ensure the Appwrite Project ID in the redirect URI is correct
- Make sure you're using the correct protocol (http vs https)

#### 3. "Access blocked" Error from Google

**Problem**: Google blocks access during OAuth flow.

**Solutions**:

- Ensure OAuth consent screen is properly configured
- Add test users if your app is still in testing mode
- Verify your app domain is added to authorized domains
- Check that all required fields in consent screen are filled

#### 4. CORS Errors

**Problem**: Cross-origin request blocked errors.

**Solutions**:

- Add your domain to authorized JavaScript origins in Google Cloud Console
- Ensure your domain is added to Appwrite platform settings
- Check that you're using the correct hostname and port

#### 5. Environment Variables Not Loading

**Problem**: Environment variables are undefined.

**Solutions**:

- Ensure `.env` file is in the project root directory
- Restart development server after changing `.env`
- Verify environment variables start with `VITE_` prefix
- Check for syntax errors in `.env` file (no spaces around =)

#### 6. Session Not Persisting

**Problem**: User gets logged out on page refresh.

**Solutions**:

- Ensure `checkAuthStatus()` is called in `useEffect`
- Verify session length is set appropriately in Appwrite
- Check browser's local storage and cookies are enabled
- Ensure no conflicting logout calls

#### 7. Google+ API Deprecated Warning

**Problem**: Google+ API is deprecated but still required.

**Solutions**:

- Continue using Google+ API as it's still required for OAuth2
- The deprecation doesn't affect OAuth2 functionality
- Monitor Google's documentation for future changes

### Debug Tips

1. **Check Browser Console**: Always check for JavaScript errors
2. **Network Tab**: Monitor API calls and responses
3. **Appwrite Console**: Check Auth logs for detailed error messages
4. **Google Cloud Console**: Check OAuth2 credentials and consent screen
5. **Environment Variables**: Use `console.log(import.meta.env)` to verify

---

## Production Deployment

### 1. Update Environment Variables

Create production `.env` file:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_production_project_id
```

### 2. Update Appwrite Settings

1. **Add Production Platform**:

   - Go to **Settings** > **Platforms**
   - Add new Web App platform with your production domain
   - Set hostname to your domain (e.g., `myapp.com`)

2. **Update OAuth2 Settings**:
   - Change success URL to: `https://yourdomain.com/dashboard`
   - Change failure URL to: `https://yourdomain.com/login`

### 3. Update Google Cloud Console

1. **Add Production Origins**:

   ```
   https://yourdomain.com
   ```

2. **Update Redirect URIs**:

   ```
   https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/[PROD_PROJECT_ID]
   ```

3. **Update OAuth Consent Screen**:
   - Add production domain to authorized domains
   - Update app domain to your production domain

### 4. Security Considerations

- Use different Appwrite projects for development and production
- Regularly rotate API keys and secrets
- Set up proper CORS policies
- Enable rate limiting in production
- Monitor authentication logs
- Set appropriate session lengths
- Use HTTPS in production

### 5. Testing Production

1. Deploy your application
2. Test email/password authentication
3. Test Google OAuth2 flow
4. Verify session persistence
5. Test logout functionality
6. Check error handling

---

## Advanced Features

### 1. Email Verification

```javascript
// Send verification email
const sendVerification = async () => {
  try {
    await account.createVerification("https://yourdomain.com/verify");
    console.log("Verification email sent");
  } catch (error) {
    console.error("Failed to send verification:", error);
  }
};

// Verify email
const verifyEmail = async (userId, secret) => {
  try {
    await account.updateVerification(userId, secret);
    console.log("Email verified successfully");
  } catch (error) {
    console.error("Verification failed:", error);
  }
};
```

### 2. Password Recovery

```javascript
// Send password recovery email
const forgotPassword = async (email) => {
  try {
    await account.createRecovery(email, "https://yourdomain.com/reset");
    console.log("Recovery email sent");
  } catch (error) {
    console.error("Failed to send recovery email:", error);
  }
};

// Reset password
const resetPassword = async (userId, secret, newPassword) => {
  try {
    await account.updateRecovery(userId, secret, newPassword, newPassword);
    console.log("Password reset successfully");
  } catch (error) {
    console.error("Password reset failed:", error);
  }
};
```

### 3. User Preferences

```javascript
// Update user preferences
const updatePreferences = async (preferences) => {
  try {
    await account.updatePrefs(preferences);
    console.log("Preferences updated");
  } catch (error) {
    console.error("Failed to update preferences:", error);
  }
};

// Get user preferences
const getPreferences = async () => {
  try {
    const prefs = await account.getPrefs();
    return prefs;
  } catch (error) {
    console.error("Failed to get preferences:", error);
  }
};
```

---

## Additional Resources

### Documentation

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite React Tutorial](https://appwrite.io/docs/tutorials/react)
- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)

### Community

- [Appwrite Discord](https://appwrite.io/discord)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/appwrite)

### Tools

- [Appwrite CLI](https://appwrite.io/docs/command-line)
- [Appwrite SDKs](https://appwrite.io/docs/sdks)
- [Postman Collection](https://www.postman.com/appwrite-team/workspace/appwrite/overview)

---

## Conclusion

You now have a complete Appwrite authentication system with both email/password and Google OAuth2 support in your React.js application. This setup provides:

- ✅ Secure user authentication
- ✅ Session management
- ✅ Multiple authentication methods
- ✅ Production-ready configuration
- ✅ Error handling and debugging

Remember to:

- Keep your credentials secure
- Test thoroughly before production deployment
- Monitor authentication logs
- Stay updated with Appwrite and Google API changes

Happy coding! 🚀
