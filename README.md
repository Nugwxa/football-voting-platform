# Football Voting Platform
A web app that provides a seamless and interactive way for fans to vote for their favorite players during events.

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: CSS Modules
- **UI Library**: Radix UI
- **Icons**: Lucide Icons
- **ORM**: Prisma
- **Database & Auth**: Supabase
- **Image Hosting**: Imgur
- **Hosting**: Vercel

## Features

- **User Authentication**:  
  - Users can register with their name, email, and password.
  - Secure login and logout functionality.
  - Users can update their account details (email, password).
  - Admins can create and manage polls and players.

- **Player Management (Admins Only)**:
  - Add, edit, and remove player information.
  - Set players as active or alumni.
  - Upload and manage player images, numbers and positions.

![Player table](https://github.com/user-attachments/assets/33077b13-d154-4a76-bc08-f41396f57518)


- **Poll Management (Admins Only)**:
  - Create and edit polls with titles, descriptions, and expiry dates.
  - Add players to polls with unlimited entries.

- **Voting System**:
  - Users must be logged in to vote.
  - Poll results are shown to users once a vote is cast.
  - Poll results are shown to everyone once the poll is closed.

![Poll result](https://github.com/user-attachments/assets/f7bf1352-a2bc-4bde-99c8-93a402dcfdcc)

## Installation

To run the project locally, follow these steps:

1. Clone the repo:

   ```bash
   git clone https://github.com/nugwxa/football-voting-platform.git
   cd football-voting-platform
2. Install dependencies:

   ```bash
   npm install
3. Update your .env file with the values from the .env.example file.
4. Run the development server :

   ```bash
   npm run dev
5. Open [http://localhost:3000](http://localhost:3000) to view the application.
