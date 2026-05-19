# Haiti Bridge Group
        
Create a modern professional real estate marketplace platform called Haiti Bridge Group for Haiti.

- Search categories:
  - Houses for rent
  - Houses for sale
  - Land for sale
  - Apartments
  - Commercial properties

- Search filters:
  - City
  - Price
  - Property type
  - Bedrooms
  - Location

- Homepage style: professional look similar to Zillow and Airbnb.

- Agent capabilities:
  - Account creation with email and password
  - Identity verification via ID card or passport upload
  - Email verification confirmation
  - Verified badge after approval
  - Upload property photos and videos
  - Add property address
  - Add phone number
  - Add WhatsApp contact button
  - Add property description and price

- Features:
  - Agent dashboard
  - Admin dashboard
  - Property listing pages
  - Property detail page
  - Favorites system
  - Featured properties section
  - Appointment booking system
  - Chat system
  - WhatsApp messaging system
  - Email notifications
  - Report fake listing system
  - Reviews and ratings for agents
  - Automatic AI verification system for agents

- Subscription plans:
  - Free Plan
  - Pro Agent
  - VIP Agent

- Payment methods:
  - MonCash
  - NatCash

- Design colors: Blue, white, gold, and light gray.

- Desired quality: Professional.

Made with Floot.

# Instructions

For security reasons, the `env.json` file is not pre-populated — you will need to generate or retrieve the values yourself.  

For **JWT secrets**, generate a value with:  

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then paste the generated value into the appropriate field.  

For the **Floot Database**, download your database content as a pg_dump from the cog icon in the database view (right pane -> data -> floot data base -> cog icon on the left of the name), upload it to your own PostgreSQL database, and then fill in the connection string value.  

**Note:** Floot OAuth will not work in self-hosted environments.  

For other external services, retrieve your API keys and fill in the corresponding values.  

Once everything is configured, you can build and start the service with:  

```
npm install -g pnpm
pnpm install
pnpm vite build
pnpm tsx server.ts
```
