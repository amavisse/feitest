# Shopify Technical Test

## Overview
This project consists of three tasks related to Shopify development:

### Task 1: Liquid Snippet - Custom Product Badge
- Write a **Liquid snippet** to display an **"On Sale"** badge on the product page.
- Handle products with multiple variants where only some variants are on sale.

### Task 2: GraphQL Admin API - Retrieve Orders
- Use Shopify's **GraphQL Admin API** to retrieve all orders from the last **30 days** containing a specific **product ID**.
- Implement pagination and query cost optimization.

### Task 3: Webhook Handling & Price Drop Alert
- Handle a **Shopify webhook** triggered when a product is updated.
- Log updated product details.
- Send an **email alert** if the price drops by more than **20%**.

## Features
- **Liquid Snippet for Product Badges**
- **Shopify Webhook Handling & Secure Authentication**
- **GraphQL API Requests with Pagination & Query Cost Checking**
- **Dynamic Email Alerts with Nodemailer**

## Setup & Installation

### Installation
Clone this repository:
```sh
git clone https://github.com/amavisse/feitest.git
cd feitest
```

### Install dependencies and run the project
You can play with this project in a quite interactive way
```sh
npm i .
npm start
```

You will be greeted by a prompt and you can choose which task to play

![image](https://github.com/user-attachments/assets/c8b87d68-3180-45c9-a243-605f2b045b70)

### Task1
You can find the liquid snippet here [https://github.com/amavisse/feitest/blob/master/src/task1/product-sale-badge.liquid](url)

The snippet accurately adds a custom "On Sale" badge when a product is on sale and is hidden when there is no discount

Running the task inside the prompt will trigger a playwright e2e test, which will check whether the badge appears or not correctly

To run this you might have to install playwright browsers, it's quite heavy though
```sh
npx playwright install
```

### Task2
Running the task you will be prompted to pick a product

The products are fetched from Shopify with Admin Graphql API and inserted into the prompt

Upon choosing a product, the app will fetch all order from last 30days and filter only those that contain the selected product ID, in all its variants if available

### Task3
For this task I assumed you'd like to see a real price change, instead of simply checking the difference between ```compareAtPrice``` and ```price``` 

To achieve this I stored the products details in MongoDB, so I can check if there was a real price change on each webhook payload

Running the task you will be prompted to pick a product again

This time it will ask you how much discount you'd like to apply to it ranging from 1 to 99 in percentage

Once confirmed, the app will fetch the product details from Shopify and apply the discount with a GraphQL mutation, if the product doesn't have a greater discount already applied

As soon as the mutation is completed, Shopify will trigger a webhook because of the changes to the product

The webhook points to this deployed server on Vercel, running with express.js

You can see and test the server locally, but because the webhook points to deployed project, you may not test the webhook, and that is also the reason why all the server and database env vars are optional in dev

Once the server receives the webhook, the server will validate its signature and confirm its authenticity

Then it will store the webhook eventId inside MongoDB to keep track of it and avoid duplicate requests

After everything checks out, the app will finally compare the data from MongoDB, the timestamps, update the database and determine whether there were any variants eligible to be sent via email

To send the email I use nodemailer with gmail app password [https://support.google.com/mail/answer/185833?hl=en-GB](url)
For this step you need to provide me with the recipient email if you'd like to see the email alert, so I can update my production env



