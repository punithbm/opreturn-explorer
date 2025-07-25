# Bitcoin Bomber 💣 - OP_RETURN Explorer

A full-stack Bitcoin OP_RETURN transaction explorer that indexes and analyzes embedded data on the Bitcoin blockchain.

## 🚀 Features

- **Real-time Bitcoin block syncing** starting from block 400,000
- **OP_RETURN data extraction** with UTF-8 and hex decoding
- **Beautiful dark theme UI** inspired by professional blockchain explorers
- **Multi-page dashboard** with comprehensive analytics
- **Fee analysis** and transaction pattern insights
- **Raw data inspection** with copy-to-clipboard functionality
- **Responsive design** that works on all devices

## 🛠 Tech Stack

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MySQL** for data persistence
- **Blockstream Esplora API** for Bitcoin data
- **Background sync jobs** every 10 minutes

### Frontend
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **Lucide React** for icons

## 📋 Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- MySQL database server

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Make the setup script executable
chmod +x start.sh

# Run the startup script (installs dependencies and starts both services)
./start.sh
```

### 2. Manual Setup (Alternative)

```bash
# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies  
cd ../frontend
pnpm install
```

### 3. Database Setup

Configure your MySQL database server and create the database:

```bash
# Create the database
mysql -u [your_username] -p -e "CREATE DATABASE operturn_explorer;"

# Initialize the schema and sample data
mysql -u [your_username] -p < create-tables.sql
```

### 4. Environment Configuration

Copy the example environment files and configure with your credentials:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment  
cp frontend/.env.local.example frontend/.env.local
```

**Backend (.env)** - Update with your database credentials:
```env
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=operturn_explorer
ESPLORA_BASE_URL=https://blockstream.info/api
INITIAL_BLOCK_HEIGHT=905000
SYNC_INTERVAL_MINUTES=10
PORT=3001
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Running the Application

### Option 1: Use the Startup Script
```bash
./start.sh
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
pnpm run dev

# Terminal 2 - Frontend  
cd frontend
pnpm dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📊 API Endpoints

### GET /api/opreturns
Get paginated OP_RETURN transactions
```bash
curl "http://localhost:3001/api/opreturns?page=1&limit=10"
```

### GET /api/stats  
Get comprehensive statistics
```bash
curl "http://localhost:3001/api/stats"
```

### GET /health
Health check endpoint
```bash
curl "http://localhost:3001/health"
```

## 🎯 Application Pages

### 1. Browse (`/browse`)
- Main dashboard with key statistics
- Recent OP_RETURN transactions table
- Real-time data updates

### 2. Transactions (`/transactions`)  
- Advanced search and filtering
- Detailed transaction view
- Copy-to-clipboard functionality

### 3. Blocks (`/blocks`)
- Block explorer with OP_RETURN stats
- Block metadata and transaction counts
- Links to external block explorers

### 4. Statistics (`/statistics`)
- Comprehensive analytics dashboard
- Time series charts
- Data type distribution analysis

### 5. Fee Analysis (`/fee-analysis`)
- Fee distribution charts
- Fee trends over time
- Fee vs data size correlation

### 6. Raw Data (`/raw-data`)
- Raw hex data inspection
- Decoded text content
- Export functionality

## 🔄 How It Works

1. **Initial Sync**: On startup, the backend begins syncing Bitcoin blocks from block 400,000
2. **Block Processing**: Each block is scanned for transactions containing OP_RETURN outputs
3. **Data Extraction**: OP_RETURN data is extracted, decoded, and stored with transaction metadata
4. **Continuous Updates**: Every 10 minutes, the system checks for new blocks and processes them
5. **API Serving**: The backend exposes REST APIs for the frontend to consume
6. **Real-time Dashboard**: The frontend displays live data with automatic updates

## 📁 Project Structure

```
bitcoin-bomber/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── services/       # Bitcoin & Database services  
│   │   ├── jobs/           # Background sync jobs
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript definitions
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/               # Next.js React app
│   ├── src/
│   │   ├── app/           # Next.js 14 app directory
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and API client
│   │   └── types/        # TypeScript definitions
│   ├── .env.local        # Frontend environment
│   └── package.json
├── create-tables.sql     # Database schema
├── start.sh              # Startup script
└── README.md
```

## 🐛 Troubleshooting

### Backend Issues
- **Database Connection**: Ensure MySQL server is accessible and credentials are correct
- **API Rate Limiting**: Blockstream API has rate limits; sync may be slow
- **Memory Usage**: Large block processing can use significant memory

### Frontend Issues  
- **CSS Not Loading**: Run `rm -rf .next && pnpm dev` to clear Next.js cache
- **API Connection**: Verify backend is running on port 3001
- **Path Resolution**: Ensure TypeScript paths are configured correctly

### Common Solutions
```bash
# Clear all caches and reinstall
rm -rf backend/node_modules frontend/node_modules
rm -rf frontend/.next
cd backend && pnpm install && cd ../frontend && pnpm install

# Restart with fresh cache
./start.sh
```

## 🎨 Customization

### Changing the Theme
Edit `frontend/src/app/globals.css` to modify CSS variables:
```css
:root {
  --primary: 142.1 76.2% 36.3%;  /* Green theme */
  --background: 222.2 84% 4.9%;   /* Dark background */
}
```

### Adjusting Sync Settings
Modify `backend/.env`:
```env
INITIAL_BLOCK_HEIGHT=500000     # Start from different block
SYNC_INTERVAL_MINUTES=5         # Sync every 5 minutes
```

### Adding New API Endpoints
1. Create route in `backend/src/routes/api.ts`
2. Add corresponding frontend API call in `frontend/src/lib/api.ts`
3. Update TypeScript types in respective `types/` directories

## 📈 Performance Notes

- **Initial sync** from block 400,000 to current tip may take several hours
- **Memory usage** peaks during block processing (monitor RAM)
- **API rate limits** from Blockstream may slow down sync
- **Database size** grows approximately 1MB per 1000 OP_RETURN transactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Blockstream** for the excellent Esplora API
- **shadcn/ui** for beautiful component library
- **Bitcoin Core** developers for the amazing protocol
- **Next.js** and **Tailwind CSS** teams for excellent tooling

---

**Happy exploring! 💣⚡** 