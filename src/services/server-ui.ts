export const getServerUI = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TEKSOi Leather | Backend API</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #d4af37;
                --bg: #0a0a0a;
                --card-bg: #141414;
                --text: #ffffff;
                --text-muted: #a0a0a0;
                --success: #10b981;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background-color: var(--bg);
                color: var(--text);
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                overflow: hidden;
            }

            .container {
                text-align: center;
                z-index: 1;
                padding: 2rem;
                max-width: 600px;
                width: 100%;
            }

            .logo {
                font-size: 2.5rem;
                font-weight: 700;
                letter-spacing: -1px;
                margin-bottom: 1rem;
                background: linear-gradient(45deg, #fff, var(--primary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: fadeInDown 1s ease-out;
            }

            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(16, 185, 129, 0.1);
                color: var(--success);
                padding: 0.5rem 1rem;
                border-radius: 100px;
                font-size: 0.875rem;
                font-weight: 600;
                margin-bottom: 2rem;
                border: 1px solid rgba(16, 185, 129, 0.2);
                animation: fadeIn 1.5s ease-out;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                background-color: var(--success);
                border-radius: 50%;
                box-shadow: 0 0 10px var(--success);
                animation: pulse 2s infinite;
            }

            .card {
                background: var(--card-bg);
                border: 1px solid rgba(255, 255, 255, 0.05);
                padding: 2.5rem;
                border-radius: 24px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(10px);
                animation: fadeInUp 1s ease-out;
            }

            h1 {
                font-size: 1.5rem;
                margin-bottom: 0.75rem;
                font-weight: 600;
            }

            p {
                color: var(--text-muted);
                line-height: 1.6;
                margin-bottom: 2rem;
            }

            .api-link {
                display: inline-block;
                color: var(--primary);
                text-decoration: none;
                font-weight: 600;
                font-size: 0.875rem;
                transition: all 0.3s ease;
                padding: 0.5rem 1rem;
                border: 1px solid var(--primary);
                border-radius: 8px;
            }

            .api-link:hover {
                background: var(--primary);
                color: #000;
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
            }

            /* Background Animation */
            .bg-glow {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                height: 600px;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
                z-index: 0;
                pointer-events: none;
            }

            @keyframes fadeInDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.5); opacity: 0.5; }
                100% { transform: scale(1); opacity: 1; }
            }
        </style>
    </head>
    <body>
        <div class="bg-glow"></div>
        <div class="container">
            <div class="logo">TEKSOi Leather</div>
            <div class="status-badge">
                <div class="status-dot"></div>
                System Operational
            </div>
            <div class="card">
                <h1>Backend API Service</h1>
                <p>The core engine powering TEKSOi Leather's digital experience. Secure, fast, and reliable order processing.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
