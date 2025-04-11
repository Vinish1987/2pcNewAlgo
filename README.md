# 2PC ALGO Trading Platform

A custom algorithmic trading platform with Pine Script integration, implementing the "VINISH BUY SELL TRAP ZONE" indicator.

## Features

- Responsive web interface built with React
- Custom Vinish Trap Zone indicator implementation
- Interactive charts using lightweight-charts
- Support for multiple timeframes (1min, 5min, 1day, 1month)
- Multiple symbol support (AAPL, MSFT, GOOGL, etc.)
- Simulated Kite Zerodha integration

## Local Development

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Deployment to 2pcalgo.com

### Option 1: Manual Deployment

1. Build the production version:
```
npm run build
```

2. Upload the contents of the `build` folder to your web hosting for 2pcalgo.com.

### Option 2: Netlify Deployment (Recommended)

1. Create a Netlify account and connect it to your Git repository.

2. Configure your deployment settings:
   - Build command: `npm run build`
   - Publish directory: `build`

3. Set up your custom domain (2pcalgo.com) in the Netlify dashboard:
   - Go to Site settings > Domain management
   - Add your custom domain and follow the instructions to set up DNS records

4. Deploy your site:
   - Netlify will automatically build and deploy your site when you push changes to your repository
   - You can also trigger manual deploys from the Netlify dashboard

### Option 3: Using Netlify CLI

1. Install Netlify CLI:
```
npm install netlify-cli -g
```

2. Login to Netlify:
```
netlify login
```

3. Initialize your site:
```
netlify init
```

4. Deploy your site:
```
netlify deploy --prod
```

## Login Credentials (Demo)

- Client ID: 9016388002
- Password: 1234

## Pine Script Indicators

### 1. Standard Trend Indicator
A combination of EMA crossover and RSI signals for trend following.

### 2. VINISH BUY SELL TRAP ZONE
A custom indicator that identifies buying and selling opportunities based on RSI-Heikin Ashi candles and predetermined trap zones.

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/2pc-algo.git
cd 2pc-algo
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select the algorithm strategy from the navigation bar
2. Adjust the algorithm parameters as needed
3. Click "Run Backtest" to see the performance results
4. View the generated signals and trading performance

## Customizing Pine Script Indicators

The Pine Script indicators have been converted to JavaScript for use in this application. You can modify the indicator parameters:

- In the VINISH BUY SELL TRAP ZONE page:
  - Adjust CALLPUT Length (RSI period)
  - Modify trap zone levels (CE TRAP, PE TRAP, Extremes)
  - Change smoothing factor

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Vinish Kumar for the VINISH BUY SELL TRAP ZONE indicator
- TradingView for the Pine Script language reference
- Lightweight Charts for the charting library # 2pcNewAlgo
# 2pcNewAlgo
# FE_2PC_Algo
