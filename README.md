# ChemActiva Innovations Website

Official website for ChemActiva Innovations Pvt Ltd - Pioneering Sustainable Nano Cellulose

## About

ChemActiva Innovations is a deep-tech startup incubated at RISE Foundation IISER, IISER Kolkata. We specialize in developing sustainable nano cellulose products and eco-friendly solutions for environmental challenges.

## Features

- 🌱 Sustainable nanocellulose products (Greenulos™)
- 🛢️ Oil spill cleanup kits (domestic and marine)
- 🔬 Bio-based solutions for a circular economy
- 📱 Progressive Web App (PWA) with offline support
- 🎨 Modern, responsive design
- ⚡ Optimized performance with service workers

## Development Setup

### Prerequisites

- Node.js 18.x or 20.x
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ChemActiva-Innovations-Pvt-Ltd/ChemActiva-Innovations-Pvt-Ltd.github.io.git
cd ChemActiva-Innovations-Pvt-Ltd.github.io
```

2. Install dependencies:
```bash
npm install
```

### Available Scripts

- **Development Server**: Start a local development server
  ```bash
  npm run serve
  ```
  Opens at http://localhost:8000

- **Testing**: Run Jest tests with coverage
  ```bash
  npm test
  ```

- **Watch Tests**: Run tests in watch mode for development
  ```bash
  npm run test:watch
  ```

- **Linting**: Check code quality with ESLint
  ```bash
  npm run lint
  ```

- **Fix Linting Issues**: Auto-fix linting problems
  ```bash
  npm run lint:fix
  ```

- **Validate**: Run both linting and tests
  ```bash
  npm run validate
  ```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **Automated Testing**: Runs on every push and pull request
- **Multi-version Testing**: Tests against Node.js 18.x and 20.x
- **Code Quality**: Linting checks on every commit
- **Automated Deployment**: Deploys to GitHub Pages on main branch updates

### Workflow File

Located at `.github/workflows/ci-cd.yml`

## Project Structure

```
.
├── index.html              # Main landing page
├── products/               # Products page
├── blog/                   # Blog section
├── assets/                 # Images and static assets
│   ├── images/            # Product and hero images
│   ├── icons/             # Icon assets
│   └── ...
├── css/                    # Stylesheets
├── js/                     # JavaScript modules
│   ├── tests/             # Jest test files
│   ├── main.js            # Main application logic
│   ├── sw-register.js     # Service worker registration
│   └── ...
├── .github/
│   └── workflows/         # GitHub Actions workflows
├── package.json           # npm configuration
├── jest.config.js         # Jest test configuration
├── .eslintrc.json         # ESLint configuration
└── .gitignore             # Git ignore rules

```

## Testing

The project uses Jest for unit testing with jsdom environment for DOM testing.

### Test Files

- `js/tests/basic.test.js` - Basic functionality tests
- `js/tests/AssetLoadingManager.comprehensive.test.js` - Asset loading tests
- `js/tests/setup.js` - Test environment setup

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode (useful during development)
npm run test:watch
```

## Code Quality

### Linting

The project uses ESLint with the following rules:
- ES2021 syntax support
- Browser and Node.js environment
- Jest globals recognized
- 2-space indentation
- Unix line endings
- Single quotes preferred

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment

The GitHub Actions workflow handles deployment automatically. No manual steps required.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

## Performance

- First Contentful Paint: ~1.2s
- Largest Contentful Paint: ~1.8s
- Time to Interactive: ~2.0s
- Offline support via Service Worker

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © 2023-2025 ChemActiva Innovations Pvt Ltd. All rights reserved.

## Contact

- **Email**: chemactiva.innovations@gmail.com
- **Phone**: +91 983 011 7780
- **LinkedIn**: [ChemActiva Innovations](https://www.linkedin.com/company/104465867/)
- **Address**: RISE Foundation IISER, IISER Kolkata, Mohanpur, Nadia – 741246, West Bengal, India

## Acknowledgments

- Incubated at RISE Foundation IISER, IISER Kolkata
- HDFC Parivartan CSR Grant Recipient
- DST NIDHI PRAYAS Award Winner
- Blue Economy Mission Award

---

**Pioneering Sustainable Nano Cellulose**
