# Deployment Instructions for Dripz & Kix

## Step 1: Create GitHub Repository
1. Go to https://github.com and sign in
2. Click "+" → "New repository"
3. Repository name: `dripzandkicks`
4. Make it **Public** (required for free GitHub Pages)
5. Don't check "Add a README file" (you already have one)
6. Click "Create repository"

## Step 2: Connect Your Local Repository
After creating the repo, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/dripzandkicks.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

## Step 4: Access Your Live Site
- Your site will be available at: `https://YOUR_USERNAME.github.io/dripzandkicks`
- It may take a few minutes to deploy initially

## Alternative: Quick Deploy Commands
Once you have the repository URL, run these commands:

```bash
# Add your repository (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/dripzandkicks.git

# Push to GitHub
git push -u origin main
```

## Your Site Features
✅ Responsive design
✅ Interactive shopping cart
✅ Product galleries
✅ Smooth animations
✅ Mobile-friendly
✅ SEO optimized
✅ Accessibility features

The site is ready for production and will work perfectly on GitHub Pages!