# 💳 Live Payment Setup Guide - Integrated Checkout

## What You're Getting

A fully integrated Stripe checkout with serverless backend - no server to manage!

---

## 🎯 Quick Overview

Your app will:
1. Customer fills out form and enters card details
2. Your Netlify function creates a Stripe payment intent
3. Stripe processes payment securely
4. Customer gets instant membership card

**Cost:** FREE (Netlify functions are free, Stripe charges 2.9% + $0.30 per transaction)

---

## 📦 Files You Need

You should have these new files:
- ✅ `index-live-payments.html` (updated main page)
- ✅ `netlify.toml` (Netlify config)
- ✅ `netlify/` folder with:
  - `functions/create-payment-intent.js` (payment processor)
  - `functions/package.json` (dependencies)

Plus your existing files:
- ✅ `membership-card.html`
- ✅ `manifest.json`
- ✅ `service-worker.js`
- ✅ `icon-192.png`
- ✅ `icon-512.png`
- ✅ `mr-dons-logo.png`

---

## 🚀 Step-by-Step Setup

### Step 1: Get Your Stripe Secret Key

1. Log into **Stripe Dashboard** (dashboard.stripe.com)
2. Click **Developers** in top right
3. Click **API keys** in left menu
4. You'll see two keys:
   - **Publishable key** (pk_test_...) - Already in your HTML ✓
   - **Secret key** (sk_test_...) - **COPY THIS NOW** 👈

⚠️ **IMPORTANT:** Keep your secret key SECRET! Never put it in HTML files.

---

### Step 2: Upload to Netlify

#### **Option A: Drag & Drop (Easiest)**

1. Go to **netlify.com** and log in
2. Click "Add new site" → "Deploy manually"
3. **Drag ALL files** including the netlify folder:
   ```
   📁 Your folder/
   ├── 📄 index-live-payments.html (rename to index.html)
   ├── 📄 membership-card.html
   ├── 📄 manifest.json
   ├── 📄 service-worker.js
   ├── 📄 netlify.toml
   ├── 🖼️ icon-192.png
   ├── 🖼️ icon-512.png
   ├── 🖼️ mr-dons-logo.png
   └── 📁 netlify/
       └── 📁 functions/
           ├── 📄 create-payment-intent.js
           └── 📄 package.json
   ```
4. Wait for deploy to complete (30-60 seconds)

#### **Option B: GitHub (For ongoing updates)**

1. Create GitHub account (github.com)
2. Create new repository
3. Upload all files
4. Connect repository to Netlify
5. Auto-deploys when you push changes

---

### Step 3: Add Secret Key to Netlify

This is where you add your Stripe secret key SECURELY:

1. In Netlify, go to your site
2. Click **Site configuration** → **Environment variables**
3. Click **Add a variable**
4. Add:
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** Your secret key from Step 1 (sk_test_...)
5. Click **Save**

🔒 This keeps your secret key secure - it's never in your code!

---

### Step 4: Test It!

1. Visit your Netlify URL
2. Select a plan
3. Fill out the form
4. Use test card: **4242 4242 4242 4242**
5. Expiration: Any future date (12/25)
6. CVC: Any 3 digits (123)
7. Click "Subscribe Now"

✅ **If it works:** You'll see the membership card!
❌ **If it fails:** Check the browser console (F12) for errors

---

### Step 5: Go Live!

Once testing works, switch to LIVE mode:

#### **In Stripe:**
1. Toggle from **"Test mode"** to **"Live mode"** (top right)
2. Go to **Developers** → **API keys**
3. Copy your **LIVE secret key** (sk_live_...)

#### **In Netlify:**
1. Go to **Site configuration** → **Environment variables**
2. Update `STRIPE_SECRET_KEY` with your LIVE key
3. Save

#### **In Your HTML:**
1. Open `index-live-payments.html`
2. Find this line:
   ```javascript
   const stripe = Stripe('pk_test_51SQy8XARkZXyBdo1cTxpXS1nBEdZ1PELCsBYCct0cBSE3fIfpYM0iySv7oJehdJOmNiSMSPLnndCVyczi5xs1gAq00RO9Yz2zE');
   ```
3. Replace with your LIVE publishable key (pk_live_...)
4. Re-upload to Netlify

🎉 **YOU'RE LIVE!**

---

## 🧪 Testing Checklist

Before going live, test these scenarios:

- [ ] Basic plan ($14.99) payment works
- [ ] Ultimate plan ($19.99) payment works
- [ ] Membership card appears after payment
- [ ] QR code generates correctly
- [ ] Expiration date is 30 days from now
- [ ] Member info displays correctly
- [ ] Failed payment shows error message
- [ ] Test on mobile phone
- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome

---

## 💰 Stripe Test Cards

Use these for testing:

| Card Number | Result |
|------------|---------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0000 0000 9995 | ❌ Insufficient funds |
| 4000 0025 0000 3155 | ✅ Requires authentication |

**All test cards:**
- Expiration: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## 🔍 Troubleshooting

### **Error: "Failed to create payment intent"**

**Check:**
1. Is `STRIPE_SECRET_KEY` set in Netlify environment variables?
2. Is the key correct (starts with sk_test_ or sk_live_)?
3. Is the Netlify function deployed? (Check Deploy log)

**Fix:**
- Re-deploy site after adding environment variable
- Netlify needs to rebuild to pick up new variables

---

### **Error: "Stripe publishable key not found"**

**Check:**
1. Is there a publishable key in the HTML?
2. Does it start with pk_test_ or pk_live_?

**Fix:**
- Update the Stripe initialization line in index.html

---

### **Card form doesn't appear**

**Check:**
1. Is Stripe.js loading? (Check browser console)
2. Any JavaScript errors? (F12 → Console tab)

**Fix:**
- Make sure you have internet connection
- Try different browser

---

### **Payment succeeds but no membership card**

**Check:**
1. Is localStorage enabled in browser?
2. Is membership-card.html in same folder?

**Fix:**
- Don't use private/incognito mode
- Check file paths are correct

---

### **Netlify function returns 500 error**

**Check:**
1. Netlify function logs (Site → Functions → Logs)
2. Is package.json present in functions folder?
3. Did Netlify install dependencies?

**Fix:**
- Re-deploy site
- Check function logs for specific error

---

## 📊 Viewing Payments in Stripe

After customers pay:

1. Go to **Stripe Dashboard**
2. Click **Payments** in left menu
3. See all transactions with:
   - Amount
   - Customer info
   - Member ID (in metadata)
   - Plan type (in metadata)

You can also:
- Export to CSV
- Set up email receipts
- Refund if needed
- View customer details

---

## 🔔 Optional: Email Notifications

Get notified when someone subscribes:

1. In Stripe Dashboard → **Settings**
2. Click **Emails**
3. Enable "Successful payments"
4. Add your email address
5. You'll get an email for each payment!

---

## 🚨 Important Security Notes

1. **Never commit secret keys to GitHub**
   - Always use environment variables
   - Add `.env` to `.gitignore` if using local development

2. **Use HTTPS only**
   - Netlify provides this automatically
   - Don't use on non-HTTPS sites

3. **Test thoroughly before going live**
   - Use test mode for all testing
   - Don't charge real cards in test mode

4. **Monitor for fraud**
   - Check Stripe Radar for suspicious activity
   - Set up fraud alerts in Stripe

---

## 💡 Pro Tips

1. **Set up webhook for automation**
   - Automatically email membership cards after payment
   - Update your database with new members
   - Send to Zapier for additional automation

2. **Add customer portal**
   - Let customers manage their own subscriptions
   - Stripe provides a pre-built portal

3. **Track conversions**
   - Add Google Analytics to see conversion rate
   - A/B test different pricing

4. **Offer discounts**
   - Create promo codes in Stripe
   - Add discount field to checkout

---

## 📞 Need Help?

**Netlify Issues:**
- Netlify Docs: docs.netlify.com
- Netlify Support: support.netlify.com

**Stripe Issues:**
- Stripe Docs: stripe.com/docs
- Stripe Support: support.stripe.com

**Common Questions:**
- Check browser console (F12) for errors
- Check Netlify function logs
- Check Stripe Dashboard for payment status

---

## ✅ Final Checklist

Before launching:

- [ ] Stripe account verified
- [ ] Test payments working
- [ ] Secret key added to Netlify environment
- [ ] All files uploaded to Netlify
- [ ] Mobile tested
- [ ] Live keys added (when ready to go live)
- [ ] QR codes printed with correct URL
- [ ] Staff trained on scanning QR codes
- [ ] Email notifications set up

---

## 🎉 You're Ready!

Your integrated checkout is now live! Customers can:
1. Visit your site
2. Choose a plan
3. Pay with credit card
4. Get instant membership card

**Next steps:**
1. Test with test cards
2. When ready, switch to live mode
3. Start promoting!

Good luck! 🚀
