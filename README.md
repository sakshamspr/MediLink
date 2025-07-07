
# Hospital Finder

A modern web application that helps users find nearby hospitals based on their location with an intuitive map interface and detailed hospital information.

## Features

- **Location-based Hospital Search**: Find hospitals near your current location
- **Interactive Map**: Visual representation of hospital locations with custom markers
- **Customizable Search Radius**: Select search radius from 1km to 25km
- **Detailed Hospital Information**: View hospital names, addresses, distances, and types
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Results**: Dynamic search results based on your selected criteria

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Build Tool**: Vite
- **Maps & Location**: Geoapify API for maps and places search
- **Icons**: Lucide React
- **State Management**: React Query (@tanstack/react-query)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd hospital-finder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Configuration

The application uses the Geoapify API for location services. The API key is currently embedded in the code, but for production use, you should:

1. Get your own API key from [Geoapify](https://www.geoapify.com/)
2. Replace the API key in the `HospitalMap` component
3. Consider using environment variables for better security

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── HospitalMap.tsx # Map component with hospital markers
│   └── HospitalList.tsx # Hospital listing component
├── pages/              # Page components
│   └── Hospitals.tsx   # Main hospital finder page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── integrations/       # External service integrations
```

## Key Components

### HospitalMap
- Displays an interactive map with hospital locations
- Shows user's current position
- Customizable search radius visualization
- Static map implementation with custom markers

### HospitalList
- Lists hospitals with detailed information
- Shows distance from user location
- Displays hospital types and categories
- Responsive card-based layout

### Hospital Search
- Location permission handling
- Radius-based search functionality
- Real-time results updating
- Error handling and user feedback

## Usage

1. **Allow Location Access**: Grant location permission when prompted
2. **Select Search Radius**: Choose your preferred search radius (1-25km)
3. **View Results**: Browse hospitals on both the map and list view
4. **Hospital Details**: Click on hospital cards to view detailed information

## API Integration

The application integrates with Geoapify API for:
- Geocoding and reverse geocoding
- Places search for healthcare facilities
- Static map generation with custom markers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Build and Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Geoapify](https://www.geoapify.com/) for location and mapping services
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [React](https://reactjs.org/) for the frontend framework
