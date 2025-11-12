# Going Live with Real Payments - Setup Guide

## ✅ What's Updated:

1. **Live Stripe Key Added** - pk_live_51SQy82...
2. **Demo Mode Disabled** - Real payments will now process
3. **Backend Function Created** - create-payment-intent.js

---

## 🚀 How to Deploy (Choose One Option)

### **OPTION 1: Netlify with Serverless Function (RECOMMENDED)**

This uses the backend function I created for you.

#### **Step 1: Upload to Netlify**

1. Go to **netlify.com** and sign up
2. Click "Add new site" → "Deploy manually"
3. Create this folder structure on your computer:

```
mrdons-subscription/
├── index.html
├── membership-card.html  
├── manifest.json
├── service-worker.js
├── icon-192.png
├── icon-512.png
├── mr-dons-logo.png
└── netlify/
    └── functions/
        └── create-payment-intent.js
```

4. Drag the **entire folder** into Netlify

#### **Step 2: Add Your Stripe Secret Key**

1. In Netlify, go to **Site settings** → **Environment variables**
2. Click "Add a variable"
3. Name: `STRIPE_SECRET_KEY`
4. Value: Your Stripe **SECRET** key (starts with `sk_live_...`)
   
   **⚠️ IMPORTANT:** This is DIFFERENT from the publishable key!
   - Go to Stripe Dashboard → Developers → API Keys
   - Copy the "Secret key" (click "Reveal test key token")

5. Click "Save"

#### **Step 3: Install Dependencies**

Netlify needs to install Stripe library. Create a `package.json` file:

```json
{
  "name": "mrdons-subscription",
  "version": "1.0.0",
  "dependencies": {
    "stripe": "^14.0.0"
  }
}
```

Upload this file to the root folder.

#### **Step 4: Redeploy**

1. Upload the `package.json` file
2. Netlify will automatically reinstall
3. Your site is now LIVE with real payments! ✅

---

### **OPTION 2: Use Stripe Payment Links (EASIEST - NO CODE)**

Skip all the backend complexity:

#### **Step 1: Create Payment Links in Stripe**

1. Go to Stripe Dashboard
2. Click "Payment Links" in left menu
3. Click "Create payment link"

**For Basic Plan ($14.99):**
- Product name: "Soda Fountain Society"
- Price: $14.99
- Recurring: Monthly
- Description: "Unlimited fountain sodas, tea, lemonade, and coffee"
- Click "Create link"
- Copy the URL (like: `https://buy.stripe.com/abc123`)

**For Ultimate Plan ($19.99):**
- Product name: "Ultimate Soda Fountain Society"
- Price: $19.99
- Recurring: Monthly
- Description: "Unlimited sodas, tea, lemonade, coffee, AND milkshakes"
- Click "Create link"
- Copy the URL

#### **Step 2: Create Simple Landing Page**

Replace your complex app with simple buttons:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mr Don's Soda Fountain Society</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #FDB714 0%, #8B4513 100%);
            padding: 40px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 20px;
        }
        .logo {
            max-width: 300px;
            margin: 0 auto 30px;
            display: block;
        }
        .plan {
            border: 3px solid #8B4513;
            padding: 30px;
            margin: 20px 0;
            border-radius: 15px;
        }
        .btn {
            background: linear-gradient(135deg, #FDB714 0%, #8B4513 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="mr-dons-logo.png" class="logo">
        <h1 style="text-align: center; color: #8B4513;">Join the Soda Fountain Society!</h1>
        
        <div class="plan">
            <h2>Soda Fountain Society - $14.99/month</h2>
            <ul>
                <li>Unlimited fountain sodas</li>
                <li>Unlimited iced tea & lemonade</li>
                <li>Unlimited coffee</li>
            </ul>
            <a href="YOUR_STRIPE_LINK_1" class="btn">Subscribe Now</a>
        </div>
        
        <div class="plan" style="background: #FFF9E6;">
            <h2>Ultimate Soda Fountain Society - $19.99/month</h2>
            <ul>
                <li>Unlimited fountain sodas</li>
                <li>Unlimited iced tea & lemonade</li>
                <li>Unlimited coffee</li>
                <li>✨ Unlimited milkshakes!</li>
            </ul>
            <a href="YOUR_STRIPE_LINK_2" class="btn">Subscribe Now - Most Popular!</a>
        </div>
    </div>
</body>
</html>
```

Replace `YOUR_STRIPE_LINK_1` and `YOUR_STRIPE_LINK_2` with your actual Stripe Payment Links.

#### **Step 3: Upload to Netlify**

Just this simple HTML file + logo. Done!

---

## 🎯 Which Option Should You Choose?

### **Choose Netlify with Function if:**
- You want the custom membership card experience
- You want full control
- You're comfortable with a bit of technical setup

### **Choose Stripe Payment Links if:**
- You want to go live TODAY
- You want zero technical hassle
- You don't mind Stripe's checkout page
- You can manually send membership info

---

## ⚠️ Before Going Live - CRITICAL CHECKLIST:

- [ ] **Test with a real card** ($1 test payment)
- [ ] **Verify money reaches your bank account**
- [ ] **Train staff** on how to scan QR codes
- [ ] **Print QR codes** for tables
- [ ] **Test membership card** displays properly
- [ ] **Have a plan** for when cards expire (renewal emails?)
- [ ] **Test on both iPhone and Android**
- [ ] **Check Stripe email receipts** look good

---

## 📱 Getting Your Stripe Secret Key

1. Go to: https://dashboard.stripe.com
2. Click **Developers** (top right)
3. Click **API keys**
4. You'll see two keys:
   - **Publishable key** (pk_live_...) - Already in your code ✅
   - **Secret key** (sk_live_...) - Click "Reveal" and copy

**⚠️ NEVER share your secret key publicly!** Only put it in Netlify environment variables.

---

## 🆘 Need Help?

**If using Netlify:**
- Netlify docs: docs.netlify.com
- Stripe docs: stripe.com/docs

**If using Payment Links:**
- Stripe support: support.stripe.com
- It's really simple - just click and link!

---

## 💡 My Recommendation:

**Start with Stripe Payment Links** to get money flowing TODAY. You can always switch to the custom app later once you're making sales!

The fancy membership card is cool, but getting your first 10 customers is more important. Stripe Payment Links work perfectly and you can be live in 10 minutes.

---

## ✅ Next Steps:

1. **Decide:** Netlify Function OR Payment Links?
2. **Set it up** (follow steps above)
3. **Test with $1**
4. **Go live!**
5. **Print QR codes**
6. **Start selling!** 🎉

Want help with either option? Let me know which path you want to take!
