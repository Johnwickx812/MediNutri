# 🏥 MediNutri

**AI-Powered Food-Drug Interaction & Smart Diet Safety Platform**

> A comprehensive health management platform that combines medication reminders, food-drug interaction alerts, and intelligent diet tracking in one unified system.

## 🌟 Why MediNutri?

While general AI chatbots can answer health questions and single-purpose apps handle either medication OR diet tracking, **MediNutri integrates everything** you need to manage your health safely:

- 💊 Smart medication reminders with conflict detection
- ⚠️ Real-time food-drug interaction warnings
- 🍎 Intelligent diet planning and meal logging
- 📊 Health reports for doctors
- 🔒 Secure, personalized health data management

**The difference?** Other apps don't cross-reference your medications with your diet. MediNutri does.

## ✨ Features

### Medication Management
- Set up personalized medicine schedules
- Receive timely reminders
- Track adherence and history
- Check for drug-drug interactions

### Food-Drug Interaction Safety
- Real-time alerts when logging meals
- Comprehensive interaction database
- Severity ratings (mild, moderate, severe)
- Evidence-based recommendations

### Diet Tracking & Planning
- Log meals with nutritional breakdown
- Smart diet plan generation
- Macro and calorie tracking
- Meal history visualization

### Health Reporting
- Generate comprehensive health reports
- Track medication adherence over time
- Diet pattern analysis
- Export reports for healthcare providers

## 🚀 Tech Stack

**Frontend**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Modern component architecture

**Backend**
- FastAPI (Python)
- PostgreSQL database
- RESTful API design
- JWT authentication

**Deployment**
- Frontend: Vercel
- Backend: [Your backend hosting]
- Database: PostgreSQL on [Your DB host]

## 📊 Database Schema

MediNutri uses a robust relational database with six core tables:

- `users` - User accounts and profiles
- `medications` - Medication catalog and schedules
- `food_items` - Nutritional food database
- `food_drug_interactions` - Interaction mappings
- `diet_plans` - Personalized diet plans
- `meal_logs` - User meal tracking data

All tables use UUIDs for primary keys and include proper indexing for performance.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 14+

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/medinutri.git
cd medinutri

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your API endpoint

# Run development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
# Create PostgreSQL database and update .env

# Run migrations
python migrate.py

# Start server
uvicorn main:app --reload
```


## 📱 Live Demo

Visit the live application: [medi-nutri.vercel.app](https://medi-nutri.vercel.app)


## 🎯 Project Goals

MediNutri was developed as a BCA capstone project at Akshaya College of Arts and Science to address the critical gap in integrated health management platforms. The goal is to provide users with a comprehensive tool that:

1. Prevents dangerous food-drug interactions
2. Improves medication adherence
3. Supports healthier dietary choices
4. Facilitates better communication with healthcare providers

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Doctor portal for patient monitoring
- [ ] Integration with pharmacy APIs
- [ ] ML-based meal recommendations
- [ ] Barcode scanning for food items
- [ ] Wearable device integration
- [ ] Multi-language support

## 🤝 Contributing

This is an academic project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**JohnWick**  
BCA Final Year Student  

- 🌐 Project: [medi-nutri.vercel.app](https://medi-nutri.vercel.app)
- 📧 Email: [dipinibl@gmail.com]


---

**⚠️ Disclaimer:** MediNutri is an educational project and should not replace professional medical advice. Always consult healthcare providers for medical decisions.

**💡 Note:** This platform demonstrates the integration of modern web technologies with healthcare data management. It showcases full-stack development skills, database design, and user-centered design principles.
