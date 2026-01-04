# EC2 Deployment Guide

This guide will help you deploy the Student Information System to your EC2 instance with nginx, Node.js, and PostgreSQL.

## Prerequisites

- EC2 instance running Ubuntu/Debian (or similar Linux distribution)
- nginx installed
- Node.js installed (v14 or higher)
- PostgreSQL installed and running
- SSH access to your EC2 instance

## Pre-Deployment Checklist

1. **Transfer files to EC2**
   ```bash
   # On your local machine
   scp -r /var/www/devops/react-node-postgress-template user@your-ec2-ip:/var/www/
   ```

2. **SSH into your EC2 instance**
   ```bash
   ssh user@your-ec2-ip
   ```

3. **Install required packages (if not already installed)**
   ```bash
   sudo apt update
   sudo apt install -y nginx postgresql nodejs npm
   ```

## Database Setup

1. **Connect to PostgreSQL**
   ```bash
   sudo -u postgres psql
   ```

2. **Create database and user**
   ```sql
   CREATE DATABASE studentdb;
   CREATE USER studentuser WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE studentdb TO studentuser;
   \q
   ```

3. **Update backend/.env file**
   ```bash
   cd /var/www/react-node-postgress-template/backend
   cp ../deploy/.env.production.example .env
   nano .env  # Edit with your database credentials
   ```

4. **Seed the database**
   ```bash
   cd /var/www/react-node-postgress-template/backend
   npm install
   npm run seed
   ```

## Deployment Steps

1. **Make deployment script executable**
   ```bash
   cd /var/www/react-node-postgress-template
   chmod +x deploy/deploy.sh
   ```

2. **Run the deployment script**
   ```bash
   sudo ./deploy/deploy.sh
   ```

   The script will:
   - Install dependencies
   - Build the React frontend
   - Set up systemd service for the backend
   - Configure nginx
   - Start all services

3. **Configure nginx (if needed)**
   ```bash
   sudo nano /etc/nginx/sites-available/student-info
   ```
   
   Update the `server_name` line with your domain, or remove it to accept all domains:
   ```
   server_name _;  # Accepts all domains
   ```
   
   Test and reload nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Configure firewall (if using UFW)**
   ```bash
   sudo ufw allow 'Nginx Full'
   # Or specifically:
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

## Post-Deployment

### Verify Deployment

1. **Check backend service status**
   ```bash
   sudo systemctl status student-info-backend
   ```

2. **Check nginx status**
   ```bash
   sudo systemctl status nginx
   ```

3. **Test API endpoint**
   ```bash
   curl http://localhost:5000/api/health
   ```

4. **Test frontend**
   Open your browser and navigate to `http://your-ec2-ip`

### Useful Commands

**Backend Service Management:**
```bash
# View logs
sudo journalctl -u student-info-backend -f

# Restart service
sudo systemctl restart student-info-backend

# Stop service
sudo systemctl stop student-info-backend

# Start service
sudo systemctl start student-info-backend
```

**Nginx Management:**
```bash
# Restart nginx
sudo systemctl restart nginx

# Reload nginx (without downtime)
sudo systemctl reload nginx

# Test nginx configuration
sudo nginx -t

# View nginx error logs
sudo tail -f /var/log/nginx/error.log
```

**PostgreSQL Management:**
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Check PostgreSQL status
sudo systemctl status postgresql

# Connect to database
sudo -u postgres psql -d studentdb
```

## Updating the Application

1. **Transfer updated files to EC2**
   ```bash
   scp -r /var/www/devops/react-node-postgress-template user@your-ec2-ip:/var/www/
   ```

2. **Run deployment script again**
   ```bash
   cd /var/www/react-node-postgress-template
   sudo ./deploy/deploy.sh
   ```

   Or manually:
   ```bash
   cd /var/www/react-node-postgress-template/backend
   npm install --production
   
   cd ../frontend
   npm install
   npm run build
   
   sudo systemctl restart student-info-backend
   sudo systemctl reload nginx
   ```

## Troubleshooting

### Backend not starting

1. Check service logs:
   ```bash
   sudo journalctl -u student-info-backend -n 50
   ```

2. Verify .env file exists and has correct values:
   ```bash
   cat /var/www/react-node-postgress-template/backend/.env
   ```

3. Check database connection:
   ```bash
   sudo -u postgres psql -d studentdb -c "SELECT 1;"
   ```

### Nginx errors

1. Check nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

2. Verify nginx configuration:
   ```bash
   sudo nginx -t
   ```

3. Check file permissions:
   ```bash
   ls -la /var/www/react-node-postgress-template/frontend/build
   ```

### Port already in use

If port 5000 is already in use:
```bash
sudo lsof -i :5000
# Kill the process or change PORT in backend/.env
```

## SSL/HTTPS Setup (Optional)

For production, you should set up SSL certificates using Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

This will automatically configure nginx with SSL certificates.

## Security Recommendations

1. **Firewall**: Only open necessary ports (80, 443, 22)
2. **Database**: Use strong passwords and restrict database access
3. **Environment Variables**: Never commit .env files to version control
4. **Updates**: Keep system packages updated regularly
5. **SSH**: Use key-based authentication instead of passwords
6. **Backup**: Regularly backup your database

## Architecture

```
Internet
  ↓
EC2 Instance (Port 80/443)
  ↓
Nginx
  ├─→ /api/* → Node.js Backend (Port 5000)
  └─→ /* → React Frontend (Static files from build/)
            ↓
        PostgreSQL Database
```
