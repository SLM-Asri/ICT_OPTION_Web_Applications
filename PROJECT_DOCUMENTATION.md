# ICT OPTION Website Project Documentation

## 1. Project Overview
ICT OPTION is a corporate website for an IT and digital solutions company based in Sri Lanka. The website is designed to present the company’s services, products, portfolio, blog, and contact/quote inquiry flow to potential clients and business partners.

The current implementation is a static front-end website that focuses on responsiveness, branding, conversion, and SEO-friendly presentation.

## 2. Business Objective
The website aims to:
- Promote ICT Option as a technology and digital transformation partner
- Showcase IT services such as web development, mobile app development, cloud solutions, AI, marketing, cybersecurity, and consulting
- Present company products and previous work
- Generate inquiries through contact and quote forms
- Build trust through a professional visual identity and content structure

## 3. Technologies Used
### Front-end and Markup
- HTML5
- CSS3
- JavaScript
- JSON-driven content rendering

### Styling
- Tailwind CSS 3.4.17
- Custom CSS files for branding, layouts, components, animation, and page-specific styling

### Assets and Media
- SVG icons
- PNG/JPG/SVG marketing graphics and hero images
- Google Fonts (Poppins)

### Build and Tooling
- Node.js
- npm
- Tailwind CLI for CSS build and minification

### Project Structure
- `index.html` – main homepage
- `about.html` – company information
- `services.html` – service listing
- `products.html` – products showcase
- `portfolio.html` – completed work showcase
- `blog.html` – blog/news overview
- `contact.html` – contact page
- `quote.html` – quote request page
- `assets/css/` – site styling and Tailwind output
- `assets/js/` – dynamic behavior, rendering, forms, navigation, reveal effects
- `content/` – JSON files for services, products, blog, FAQs, forms, and site metadata

## 4. Main Languages and Stack Summary
### Languages
- HTML: page structure and content layout
- CSS: design system, layout, mobile/desktop responsiveness, animations
- JavaScript: interactions, dynamic rendering, form validation, UI behavior
- JSON: structured content management for site sections

### Stack
- Static website architecture
- Client-side rendering using JavaScript and JSON data files
- Tailwind CSS for utility-first styling and consistent UI patterns
- Custom JavaScript modules for functionality and form logic

## 5. Functionalities Implemented
### Website Navigation
- Desktop and mobile navigation menus
- Search bar interaction
- Sticky header behavior
- Internal page linking and route-based navigation

### Marketing Website Pages
- Home page with hero section and service highlight cards
- About page with company story and team sections
- Services page with service categories and detail pages
- Products page with product listing
- Portfolio page with project showcase and filters
- Blog page with featured article cards
- Contact page with company contact details and FAQ
- Quote page with inquiry form

### Content Rendering
- JSON-based content structure for reusable and maintainable site data
- Shared rendering logic for cards, detail pages, and metadata

### Forms and User Input
- Contact form with validation
- Quote wizard with multi-step flow
- Required field validation for email and phone number
- Error and success states
- Checkbox/radio/select options populated from structured data

### User Experience Features
- Smooth scrolling and transitions
- Reveal-on-scroll animations
- Responsive layout for mobile, tablet, and desktop
- Search and filtering for portfolio items and content

### SEO and Web Presence
- Meta title and description updates
- Canonical URL support
- Sitemap and robots configuration
- Social metadata support for sharing
- Favicon and branding assets

## 6. Requirements
### Technical Requirements
- Node.js installed on the machine
- npm available for dependencies and build scripts
- Access to a static website host or deployment server

### Project Requirements for Local Development
1. Open the project folder
2. Run:
   ```bash
   npm install
   ```
3. Build CSS when needed:
   ```bash
   npm run build
   ```
4. For live development or CSS watch mode:
   ```bash
   npm run watch:css
   ```

### Deployment Requirements
- Static hosting platform such as Netlify, Vercel, GitHub Pages, or traditional web hosting
- Support for serving HTML, CSS, JS, images, and JSON files
- No backend server required for the current site version

### Functional Requirements
- The website should work correctly across modern browsers
- It should remain responsive and readable on mobile devices
- Forms should validate user input before submission
- Page content should be easy to update via JSON files without changing HTML structure
- The website should maintain a professional corporate look and strong brand identity

## 7. Current Project Status
This project is currently implemented as a static website front-end with reusable content files and client-side interactions. It is suitable for business branding, lead generation, and company presentation.

## 8. Limitations / Notes
- The current implementation does not include a backend database or CRM integration
- Form submission is front-end validated but not yet connected to a real email service/API
- Content is structured in JSON files for efficient updates, but full CMS integration is not yet implemented

## 9. Client / Project Manager Summary
This project is a business website for ICT OPTION, built with HTML, CSS, JavaScript, Tailwind, and JSON-based content management. It includes a responsive corporate design, service/product presentation, portfolio showcase, blog layout, contact/quote forms, SEO support, and mobile-friendly navigation. It is designed to present the company professionally and convert visitors into inquiries.

## 10. Suggested Next Improvements
- Connect quote/contact forms to email or backend API
- Add real CMS support for content administration
- Integrate analytics and conversion tracking
- Add a working blog detail page with dynamic article content
- Add a database or customer inquiry storage system
- Add automated testing and deployment workflows
