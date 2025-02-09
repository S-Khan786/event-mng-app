<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<h1>📌 Event Management App (MERN Stack)</h1>
<p>An Event Management platform built with the <strong>MERN Stack</strong> that allows users to create, manage, and join events with real-time updates.</p>

<hr>

<h2>🚀 Features</h2>
<ul>
    <li><strong>User Authentication:</strong> Register, login, and <em>Guest Login</em> for limited access.</li>
    <li><strong>Admin Privileges:</strong> Create, update, delete, join, and leave events.</li>
    <li><strong>Guest Access:</strong> Guests can join and leave events.</li>
    <li><strong>Event Creation & Management:</strong> Form to create events with event name, description, date/time, etc.</li>
    <li><strong>Event Dashboard:</strong> Displays a list of available events.</li>
    <li><strong>Real-Time Attendee List:</strong> WebSockets enable live updates for attendees.</li>
    <li><strong>Responsive Design:</strong> Fully optimized for desktop, tablet, and mobile devices.</li>
</ul>

<hr>

<h2>🛠️ Tech Stack</h2>
<h3>Frontend:</h3>
<ul>
    <li><strong>React.js</strong> - UI Development</li>
    <li><strong>React Router</strong> - Navigation</li>
    <li><strong>Tailwind CSS / Bootstrap</strong> - Styling</li>
</ul>

<h3>Backend:</h3>
<ul>
    <li><strong>Node.js</strong> - Runtime Environment</li>
    <li><strong>Express.js</strong> - Backend Framework</li>
    <li><strong>MongoDB Atlas</strong> - Database</li>
    <li><strong>JWT Authentication</strong> - Secure login</li>
    <li><strong>WebSockets</strong> - Real-time updates</li>
</ul>

<h3>Deployment:</h3>
<ul>
    <li><strong>Frontend:</strong> Deployed on <em>Render</em></li>
    <li><strong>Backend:</strong> Hosted on <em>Render</em></li>
    <li><strong>Database:</strong> <em>MongoDB Atlas (Free)</em></li>
</ul>

<hr>

<h2>📌 Installation & Setup</h2>
<ol>
    <li>Clone the repository:
        <pre><code>git clone https://github.com/yourusername/event-management-app.git
cd event-management-app</code></pre>
    </li>
    <li>Install dependencies:
        <pre><code>npm install</code></pre>
    </li>
    <li>Start the development server:
        <pre><code>npm start</code></pre>
    </li>
</ol>

<hr>

<h2>📜 API Endpoints</h2>

<h3>Authentication API</h3>
<ul>
    <li><code>POST /api/auth/register</code> - Register a new user</li>
    <li><code>POST /api/auth/login</code> - Login user and return JWT token</li>
    <li><code>POST /api/auth/guest-login</code> - Guest login</li>
</ul>

<h3>Event Management API</h3>
<ul>
    <li><code>POST /api/events</code> - Create an event (Admin only)</li>
    <li><code>GET /api/events</code> - Fetch all events</li>
    <li><code>PUT /api/events/:id</code> - Update event (Admin only)</li>
    <li><code>DELETE /api/events/:id</code> - Delete event (Admin only)</li>
    <li><code>POST /api/events/:id/join</code> - Join an event</li>
    <li><code>POST /api/events/:id/leave</code> - Leave an event</li>
</ul>

<hr>
    <footer>
    <p>&copy; 2024 <strong>Mohammad Sahil</strong>. All rights reserved.</p>
  </footer>
</body>
</html>
