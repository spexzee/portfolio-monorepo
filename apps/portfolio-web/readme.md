# Portfolio - Modern React TypeScript Portfolio

## 🚀 Overview

A modern, interactive portfolio website built with React 18, TypeScript, and Three.js. This portfolio showcases professional experience, skills, and projects with stunning 3D animations and responsive design.

## ✨ Features

- **Interactive 3D Elements**: 3D Earth visualization and animated tech stack balls using React Three Fiber
- **Smooth Animations**: Framer Motion powered transitions and scroll-based animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Tech Stack**: Built with React 18, TypeScript, and Vite for optimal performance
- **Dynamic Content**: Data-driven components with React Query integration
- **Contact Form**: Integrated EmailJS for seamless contact functionality
- **Professional Sections**:
  - Hero section with 3D computer model
  - About section with animated services
  - Experience timeline with vertical timeline component
  - Interactive tech stack showcase
  - Project portfolio with filtering capabilities
  - Contact form with 3D Earth visualization

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 7.0.6
- **Styling**: Tailwind CSS 3.3.2
- **Animations**: Framer Motion 10.12.5
- **3D Graphics**: React Three Fiber, Three.js, React Three Drei
- **State Management**: TanStack React Query 5.83.0
- **Routing**: React Router DOM 6.11.0

### Development Tools
- **Linting**: ESLint with React and TypeScript plugins
- **Styling**: PostCSS with Autoprefixer
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/spexzee/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5174` to view the portfolio

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── API/                    # API integration and data fetching
│   ├── projects/          # Project-specific API calls
│   └── useAPI.ts         # Main API hook
├── assets/               # Static assets and icons
├── components/           # React components
│   ├── canvas/          # 3D canvas components
│   │   ├── Ball.tsx     # Animated tech balls
│   │   ├── Earth.tsx    # 3D Earth visualization
│   │   └── Stars.tsx    # Animated star field
 │   ├── About.tsx        # About section
│   ├── Contact.tsx      # Contact form
│   ├── Experience.tsx   # Experience timeline
│   ├── Hero.tsx         # Landing hero section
│   ├── Navbar.tsx       # Navigation component
│   ├── Tech.tsx         # Technology showcase
│   └── Works.tsx        # Projects portfolio
├── constants/           # Static data and configurations
├── hoc/                # Higher-order components
├── queries/            # React Query configurations
├── utils/              # Utility functions
└── styles.ts           # Global styles and theme
```

## 🎨 Key Components

### Hero Section
- Interactive 3D computer model
- Animated text with typing effects
- Smooth scroll navigation

### Experience Timeline
- Vertical timeline layout
- Professional experience at **Ornate Interior Decor**
- Animated cards with company details

### Tech Stack Visualization
- 3D floating tech balls
- Interactive hover effects
- Comprehensive technology showcase

### Projects Portfolio
- Dynamic project cards
- Category-based filtering
- Live demo and source code links
- Responsive grid layout

### 3D Earth Contact
- Interactive 3D Earth model
- EmailJS integration
- Form validation and success feedback

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `dist` folder can be deployed to:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

## 📝 Customization

### Update Personal Information
Edit `src/constants/index.ts` to update:
- Personal details and services
- Experience and testimonials
- Projects and technologies
- Navigation links

### Modify Styling
- Update `tailwind.config.ts` for theme customization
- Modify `src/styles.ts` for global styles
- Customize animations in `src/utils/motion.ts`

### Add New Sections
1. Create component in `src/components/`
2. Add to main `App.tsx`
3. Wrap with `SectionWrapper` HOC if needed
4. Update navigation in `constants/index.ts`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** for 3D graphics capabilities
- **Framer Motion** for smooth animations
- **React Three Fiber** for React Three.js integration
- **Tailwind CSS** for utility-first styling
- **EmailJS** for contact form functionality

## 📧 Contact

**Software Developer** - Ornate Interior Decor, Bengaluru, India

Project Link: [https://github.com/spexzee/portfolio](https://github.com/spexzee/portfolio)

---

⭐ Star this repository if you found it helpful!



