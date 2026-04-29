# ⚡ Quick Reference Card

## 🚀 Start NOVA in 3 Steps

### Step 1: PostgreSQL
```powershell
docker run --name nova-postgres -e POSTGRES_USER=nova_user -e POSTGRES_PASSWORD=nova_password -e POSTGRES_DB=nova_db -p 5432:5432 -d postgres:15-alpine
```

### Step 2: Backend
```powershell
cd C:\Users\Asus\Desktop\NOVA\nova\backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Step 3: Frontend
```powershell
cd C:\Users\Asus\Desktop\NOVA\nova\frontend
npm run dev
```

### Step 4: Browser
```
http://localhost:5173
```

---

## 📚 Phase 1 Content

### Lesson 1: What is Programming?
- **Time**: 12 min
- **XP**: 100
- **Topics**: Programming basics, Python intro
- **Quiz**: 2 questions
- **Exercises**: 1 exercise

### Lesson 2: Variables and Data Types
- **Time**: 18 min
- **XP**: 150
- **Topics**: Variables, data types, strings, numbers
- **Quiz**: 3 questions
- **Exercises**: 2 exercises

---

## 🎯 Test Checklist

- [ ] Open http://localhost:5173
- [ ] Click "Start Learning"
- [ ] Click "Phase 1"
- [ ] Read Lesson 1
- [ ] Try practice exercise
- [ ] Take quiz
- [ ] Go to Lesson 2
- [ ] Complete phase
- [ ] Check XP increased

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check PostgreSQL is running: `docker ps` |
| Frontend won't start | Run `npm install` first |
| Port already in use | Use different port: `--port 8001` |
| Database error | Restart PostgreSQL: `docker restart nova-postgres` |
| Changes not showing | Hard refresh: `Ctrl + Shift + R` |
| Blank page | Check browser console: `F12` |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `nova/frontend/src/pages/Phase.tsx` | Phase component (400+ lines) |
| `nova/frontend/src/config/phases.ts` | Lesson content |
| `nova/frontend/src/types/index.ts` | TypeScript types |
| `nova/backend/app/main.py` | Backend server |
| `nova/backend/app/database.py` | Database connection |

---

## 🎨 UI Tabs

| Tab | Content |
|-----|---------|
| 📖 Content | Lesson material + code examples |
| 💻 Practice | Exercises with hints + solutions |
| ❓ Quiz | Questions with scoring |
| 📚 Resources | External links |

---

## 📊 Phase 1 Stats

- **Total Lessons**: 2
- **Total XP**: 250
- **Total Time**: 30 minutes
- **Practice Exercises**: 3
- **Quiz Questions**: 5
- **Resources**: 4
- **Key Takeaways**: 8
- **Real-World Connections**: 8

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://127.0.0.1:8000 |
| Backend Docs | http://127.0.0.1:8000/docs |
| Backend Health | http://127.0.0.1:8000/health |

---

## 💾 Database

| Table | Purpose |
|-------|---------|
| users | User accounts |
| user_progress | Learning progress |
| phase_completions | Completed phases |
| rocket_parts | Unlocked parts |
| achievements | Achievements |

---

## 🎓 Learning Path

```
Phase 1: Python (Programming Foundation)
    ↓
Phase 2: Math (Mathematical Foundation)
    ↓
Phase 3: ML Basics (Machine Learning Core)
    ↓
Phase 4: Deep Learning (Neural Networks)
    ↓
Phase 5: NLP (Language Processing)
    ↓
Phase 6: Vision (Computer Vision)
    ↓
Phase 7: RL (Reinforcement Learning)
    ↓
Phase 8: Advanced (Advanced Techniques)
    ↓
Phase 9: Deploy (Deployment)
    ↓
Phase 10: Launch (Launch Sequence)
```

---

## 🚨 Common Errors

### "npm is not recognized"
- Install Node.js from nodejs.org
- Restart terminal

### "PostgreSQL connection refused"
- Start PostgreSQL: `docker start nova-postgres`
- Check it's running: `docker ps`

### "Port 5173 already in use"
- Use different port: `npm run dev -- --port 5174`

### "Module not found"
- Run `npm install` in frontend directory

### "Blank page loading"
- Check browser console (F12)
- Check backend is running
- Hard refresh (Ctrl + Shift + R)

---

## 📖 Documentation Files

- **IMPLEMENTATION_COMPLETE.md** - Full implementation details
- **RUN_NOVA_NOW.md** - Detailed setup guide
- **PHASE_1_COMPLETE.md** - Phase 1 notes
- **PHASE_1_PREVIEW.md** - UI/UX preview
- **FINAL_STATUS.md** - Status report
- **QUICK_REFERENCE.md** - This file

---

## ✅ Status

**Phase 1: COMPLETE ✅**
- All features implemented
- All content created
- All tests passing
- Ready to use

**Next: Phase 2 (Math Foundation)**

---

## 🎉 You're All Set!

Everything is ready. Just run the 3 commands above and open your browser.

**Happy Learning! 🚀**
