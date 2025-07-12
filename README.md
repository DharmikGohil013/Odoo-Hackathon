# 🔁 Skill Swap Platform – Neural Nexus

A powerful and collaborative **Skill Swap Platform** designed to help users exchange knowledge, connect based on shared interests, and build learning communities. Built as part of the **Odoo Hackathon 2025 – Problem Statement 1**.

> 🚀 Live Hackathon Project by **Team Neural Nexus**  
> 👥 Team Members: **Dharmik Gohil**, **Donda Harsh**, **Krish Gadara**

---

## 🌟 Project Overview

The platform enables users to:
- Offer and request multiple skills
- Set custom availability
- Discover users via smart recommendations
- Share multimedia learning resources
- Create and join interest-based groups
- Connect through a social system of friends and messages
- Participate in fair, rated knowledge swaps

---

## 🔧 Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| **Frontend** | React.js + Tailwind CSS / Chakra UI |
| **Backend**  | Node.js + Express or Django       |
| **Database** | PostgreSQL or MongoDB             |
| **Auth**     | JWT (JSON Web Token)              |
| **Media**    | Cloudinary / Firebase Storage     |
| **Realtime** | Socket.IO (optional chat support) |
| **Reports**  | JSON2CSV / ExcelJS                |

---

## 📦 Key Features

### 👤 User Features

- Create **public/private profiles**
- Add **multiple skills offered and wanted**
- Set your **availability** (weekdays, weekends, evenings)
- Browse users using **skill, location, availability** filters
- Initiate, accept, reject, or cancel **skill swap requests**
- Leave **ratings and reviews** after each successful swap

### 🔍 Smart Discovery

- **Skill Matchmaking** – Users needing what you offer and vice versa
- **Nearby Users** – Based on location (within 50km range)
- **College or Company Matches**
- Display **Trending Skills** based on user activity

### 📸 Skill Sharing with Multimedia

Users can enhance their skill offerings with:
- 🖼️ **Images** (e.g. diagrams, screenshots)
- 🎥 **Videos** (screen recordings, demonstrations)
- 🎤 **Audio** (voice explanations)
- 🎨 **Canvas Drawing Tool**
- 📂 **Document Uploads** (PDF, DOC, PPT, etc.)

⚠️ Admin-controlled file size/type limits (e.g. max 50MB, PDF/MP4/JPG/PNG only)

### 👥 Communities & Groups

- Create or join:
  - Skill-based groups
  - College/company communities
  - Teaching circles (for group learning sessions)
- Each group supports:
  - Name, icon, description
  - Public/private toggle
  - Member list, chatroom, and announcements

### 💬 Social Features

- Add or remove friends
- Block/unblock users
- View friends’ activity
- Private chat/messages (optional for MVP)

### 🛡️ Admin Control Panel

Admins can:
- Ban users and moderate content
- Approve or reject skill uploads
- Remove inappropriate feedback
- View swap logs, top-rated users, trending skills
- Export reports as CSV/Excel
- Post global announcements visible to all users

---

## 🧠 Recommendation Engine

- 🔄 **Skill Matching**:  
  - `skills_wanted` matches `skills_offered` from others and vice versa
- 📍 **Location Matching**:  
  - Within 50km radius (GPS or pincode)
- 🏫 **Organization Matching**:  
  - Same college/company users
- 👥 **Mutual Friends**:  
  - Highlight shared connections
- 📈 **Trending Skills**:  
  - Displayed on home feed based on demand

---

## ✅ MVP vs Full Version

| Feature                    | MVP | Full Version |
|----------------------------|-----|--------------|
| Profile & Skill Swapping   | ✅   | ✅            |
| Recommendation Engine      | 🔸  | ✅            |
| Communities & Groups       | ❌  | ✅            |
| Multimedia Skill Sharing   | 🔸  | ✅            |
| Friend/Block System        | ❌  | ✅            |
| Admin Dashboard            | ✅   | ✅            |
| Realtime Chat / Live Class | ❌  | Optional      |

> 🔸 – Partial in MVP

---

## 🛠 Getting Started (Basic)

### Backend

```bash
cd backend
npm install
npm start
