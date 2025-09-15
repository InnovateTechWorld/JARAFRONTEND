question-ai-logo
managemanage
managemanage
useruser
fullfull
closeclose
Chat AI
Hello! Is there any question I can help you with?
What is the national bird of the United States?
What is the highest peak in the United States?
Ask AI
logo
more
Jara Backend API
 1.0.0 
OAS 3.0
API for Jara - Creator monetization platform

Servers

http://localhost:3000 - Development server

Authorize
Creators


POST
/api/creators
Create a new creator profile


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "name": "string",
  "bio": "string",
  "socialLinks": [
    "string"
  ],
  "paymentPreferences": {
    "currency": "NGN",
    "flutterwave_account": "string"
  },
  "jaraPageSlug": "string"
}
Responses
Code	Description	Links
201	
Creator profile created successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "name": "string",
  "bio": "string",
  "socialLinks": [
    "string"
  ],
  "paymentPreferences": {
    "currency": "string",
    "flutterwave_account": "string"
  },
  "jaraPageSlug": "string",
  "createdAt": "2025-09-15T07:41:00.713Z",
  "updatedAt": "2025-09-15T07:41:00.713Z"
}
No links
400	
Invalid request data

No links
401	
Unauthorized

No links
409	
Creator profile already exists or slug is taken

No links
500	
Internal server error

No links

GET
/api/creators/{id}
Get creator profile by ID


Parameters
Try it out
Name	Description
id *
string
(path)
Creator ID

id
Responses
Code	Description	Links
200	
Creator profile retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "name": "string",
  "bio": "string",
  "socialLinks": [
    "string"
  ],
  "paymentPreferences": {
    "currency": "string",
    "flutterwave_account": "string"
  },
  "jaraPageSlug": "string",
  "createdAt": "2025-09-15T07:41:00.715Z",
  "updatedAt": "2025-09-15T07:41:00.715Z"
}
No links
404	
Creator not found

No links
500	
Internal server error

No links

PUT
/api/creators/{id}
Update creator profile


Parameters
Try it out
Name	Description
id *
string
(path)
Creator ID

id
Request body

application/json
Example Value
Schema
{
  "name": "string",
  "bio": "string",
  "socialLinks": [
    "string"
  ],
  "paymentPreferences": {},
  "jaraPageSlug": "string"
}
Responses
Code	Description	Links
200	
Creator profile updated successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "name": "string",
  "bio": "string",
  "socialLinks": [
    "string"
  ],
  "paymentPreferences": {
    "currency": "string",
    "flutterwave_account": "string"
  },
  "jaraPageSlug": "string",
  "createdAt": "2025-09-15T07:41:00.718Z",
  "updatedAt": "2025-09-15T07:41:00.718Z"
}
No links
400	
Invalid request data

No links
401	
Unauthorized

No links
403	
Forbidden - can only update own profile

No links
404	
Creator not found

No links
409	
Slug is already taken

No links
500	
Internal server error

No links
Crypto


GET
/api/crypto/currencies
Get available cryptocurrencies and payment methods


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Available currencies retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "currencies": [
    "string"
  ],
  "count": 0
}
No links
500	
Internal server error

No links

GET
/api/crypto/minimum-amount
Get minimum payment amount for currency pair


Parameters
Try it out
Name	Description
currency_from *
string
(query)
Source currency

currency_from
currency_to
string
(query)
Target currency (optional)

currency_to
fiat_equivalent
string
(query)
Fiat currency for equivalent calculation

Default value : usd

usd
Responses
Code	Description	Links
200	
Minimum amount retrieved successfully

No links
400	
Invalid parameters

No links
500	
Internal server error

No links

GET
/api/crypto/estimate
Get estimated price for crypto payment


Parameters
Try it out
Name	Description
amount *
number
(query)
Amount to convert

amount
currency_from *
string
(query)
Source currency

currency_from
currency_to
string
(query)
Target currency (optional)

currency_to
Responses
Code	Description	Links
200	
Estimated price retrieved successfully

No links
400	
Invalid parameters

No links
500	
Internal server error

No links

POST
/api/crypto/create-payment
Create crypto payment for payment link


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "paymentLinkId": "string",
  "customerEmail": "user@example.com",
  "customerName": "string",
  "payCurrency": "string",
  "ipnCallbackUrl": "string",
  "successUrl": "string",
  "cancelUrl": "string",
  "orderId": "string",
  "orderDescription": "string"
}
Responses
Code	Description	Links
200	
Crypto payment created successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "payment_url": "string",
  "payment_id": "string",
  "pay_address": "string",
  "pay_amount": 0,
  "pay_currency": "string",
  "order_id": "string",
  "reference": "string",
  "paymentLink": {}
}
No links
400	
Invalid request data

No links
404	
Payment link not found

No links
500	
Internal server error

No links

GET
/api/crypto/payment-status/{paymentId}
Get crypto payment status


Parameters
Try it out
Name	Description
paymentId *
string
(path)
NOWPayments payment ID

paymentId
Responses
Code	Description	Links
200	
Payment status retrieved successfully

No links
400	
Invalid payment ID

No links
500	
Internal server error

No links

POST
/api/crypto/webhook
Handle NOWPayments IPN webhook


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{}
Responses
Code	Description	Links
200	
Webhook processed successfully

No links
400	
Invalid webhook signature

No links
500	
Webhook processing error

No links

GET
/api/crypto/link/{slug}
Get payment link details by slug (for crypto payments)


Parameters
Try it out
Name	Description
slug *
string
(path)
Payment link slug

slug
Responses
Code	Description	Links
200	
Payment link details retrieved successfully

No links
404	
Payment link not found or not published

No links
500	
Internal server error

No links

GET
/api/crypto/payment-methods
Get available payment methods and currencies


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Payment methods retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "payment_methods": {
    "fiat": [
      "string"
    ],
    "crypto": [
      "string"
    ],
    "supported_pairs": [
      {}
    ]
  },
  "service": "string"
}
No links
500	
Internal server error

No links

POST
/api/crypto/convert-price
Convert payment link price to cryptocurrency


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "paymentLinkId": "string",
  "payCurrency": "string",
  "priceCurrency": "usd"
}
Responses
Code	Description	Links
200	
Price conversion successful

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "conversion": {
    "paymentLinkId": "string",
    "originalPrice": 0,
    "originalCurrency": "string",
    "cryptoPrice": 0,
    "cryptoCurrency": "string",
    "estimatedPrice": {},
    "minimumAmount": {}
  }
}
No links
400	
Invalid request data

No links
404	
Payment link not found

No links
500	
Internal server error

No links
Dashboard


GET
/api/dashboard/creator/{creatorId}/summary
Get creator earnings summary


Parameters
Try it out
Name	Description
creatorId *
string
(path)
Creator ID

creatorId
Responses
Code	Description	Links
200	
Earnings summary retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "summary": {
    "totalRevenue": 0,
    "totalTransactions": 0,
    "publishedLinks": 0,
    "revenueByCurrency": {},
    "recentRevenue": 0,
    "topPerformingLink": {}
  }
}
No links
401	
Unauthorized

No links
403	
Forbidden - can only view own dashboard

No links
500	
Internal server error

No links

GET
/api/dashboard/creator/{creatorId}/latest-transactions
Get creator's latest transactions


Parameters
Try it out
Name	Description
creatorId *
string
(path)
Creator ID

creatorId
limit
integer
(query)
Number of transactions to return

Default value : 10

10
Responses
Code	Description	Links
200	
Latest transactions retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "transactions": [
    {
      "id": "string",
      "amount": 0,
      "currency": "string",
      "status": "string",
      "customerEmail": "string",
      "customerName": "string",
      "paymentLinkTitle": "string",
      "createdAt": "2025-09-15T07:41:00.745Z"
    }
  ]
}
No links
401	
Unauthorized

No links
403	
Forbidden - can only view own transactions

No links
500	
Internal server error

No links

GET
/api/dashboard/creator/{creatorId}/quick-links
Get quick action links for creator dashboard


Parameters
Try it out
Name	Description
creatorId *
string
(path)
Creator ID

creatorId
Responses
Code	Description	Links
200	
Quick links retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "quickLinks": [
    {
      "action": "string",
      "label": "string",
      "description": "string",
      "url": "string",
      "icon": "string"
    }
  ]
}
No links
401	
Unauthorized

No links
403	
Forbidden - can only view own quick links

No links
500	
Internal server error

No links
Jara Pages


GET
/api/creators/{creatorSlug}/page
Get creator's public Jara page


Parameters
Try it out
Name	Description
creatorSlug *
string
(path)
Creator's page slug

creatorSlug
Responses
Code	Description	Links
200	
Jara page retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "page": {
    "creator": {
      "id": "string",
      "name": "string",
      "bio": "string",
      "socialLinks": [
        "string"
      ],
      "jaraPageSlug": "string"
    },
    "paymentLinks": [
      {
        "id": "string",
        "type": "string",
        "title": "string",
        "description": "string",
        "price": 0,
        "currency": "string",
        "imageUrl": "string",
        "slug": "string"
      }
    ]
  }
}
No links
404	
Creator not found

No links
500	
Internal server error

No links
Landing Pages


POST
/api/landing-pages
Create a new landing page


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "pageType": "landing",
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "slug": "string",
  "isPublished": false,
  "pageMetadata": {},
  "heroTitle": "string",
  "heroSubtitle": "string",
  "heroDescription": "string",
  "heroImageUrl": "string",
  "heroBackgroundColor": "string",
  "heroTextColor": "string",
  "contentSections": [
    {}
  ],
  "ctaButtons": [
    {}
  ],
  "testimonials": [
    {}
  ],
  "socialProof": {},
  "mediaGallery": [
    {}
  ],
  "customCss": "string",
  "themeSettings": {},
  "metaTitle": "string",
  "metaDescription": "string",
  "metaKeywords": [
    "string"
  ],
  "ogImageUrl": "string",
  "analyticsSettings": {},
  "paymentLinks": [
    "string"
  ],
  "showSocialLinks": true,
  "showTestimonials": false,
  "showMediaGallery": false,
  "contactFormEnabled": false
}
Responses
Code	Description	Links
201	
Landing page created successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "creatorId": "string",
  "pageType": "landing",
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "slug": "string",
  "isPublished": true,
  "pageMetadata": {},
  "heroTitle": "string",
  "heroSubtitle": "string",
  "heroDescription": "string",
  "heroImageUrl": "string",
  "heroBackgroundColor": "string",
  "heroTextColor": "string",
  "contentSections": [
    {}
  ],
  "ctaButtons": [
    {}
  ],
  "testimonials": [
    {}
  ],
  "socialProof": {},
  "mediaGallery": [
    {}
  ],
  "customCss": "string",
  "themeSettings": {},
  "metaTitle": "string",
  "metaDescription": "string",
  "metaKeywords": [
    "string"
  ],
  "ogImageUrl": "string",
  "analyticsSettings": {},
  "paymentLinks": [
    "string"
  ],
  "showSocialLinks": true,
  "showTestimonials": true,
  "showMediaGallery": true,
  "contactFormEnabled": true,
  "createdAt": "2025-09-15T07:41:00.756Z",
  "updatedAt": "2025-09-15T07:41:00.756Z"
}
No links
400	
Invalid request data

No links
401	
Unauthorized

No links
403	
Creator profile not found

No links
409	
Slug is already taken

No links
500	
Internal server error

No links

GET
/api/landing-pages/{id}
Get landing page by ID


Parameters
Try it out
Name	Description
id *
string
(path)
Landing page ID

id
Responses
Code	Description	Links
200	
Landing page retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "creatorId": "string",
  "pageType": "landing",
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "slug": "string",
  "isPublished": true,
  "pageMetadata": {},
  "heroTitle": "string",
  "heroSubtitle": "string",
  "heroDescription": "string",
  "heroImageUrl": "string",
  "heroBackgroundColor": "string",
  "heroTextColor": "string",
  "contentSections": [
    {}
  ],
  "ctaButtons": [
    {}
  ],
  "testimonials": [
    {}
  ],
  "socialProof": {},
  "mediaGallery": [
    {}
  ],
  "customCss": "string",
  "themeSettings": {},
  "metaTitle": "string",
  "metaDescription": "string",
  "metaKeywords": [
    "string"
  ],
  "ogImageUrl": "string",
  "analyticsSettings": {},
  "paymentLinks": [
    "string"
  ],
  "showSocialLinks": true,
  "showTestimonials": true,
  "showMediaGallery": true,
  "contactFormEnabled": true,
  "createdAt": "2025-09-15T07:41:00.760Z",
  "updatedAt": "2025-09-15T07:41:00.760Z"
}
No links
404	
Landing page not found

No links
500	
Internal server error

No links

PUT
/api/landing-pages/{id}
Update landing page


Parameters
Try it out
Name	Description
id *
string
(path)
Landing page ID

id
Request body

application/json
Example Value
Schema
{
  "pageType": "landing",
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "slug": "string",
  "pageMetadata": {},
  "heroTitle": "string",
  "heroSubtitle": "string",
  "heroDescription": "string",
  "heroImageUrl": "string",
  "heroBackgroundColor": "string",
  "heroTextColor": "string",
  "contentSections": [
    {}
  ],
  "ctaButtons": [
    {}
  ],
  "testimonials": [
    {}
  ],
  "socialProof": {},
  "mediaGallery": [
    {}
  ],
  "customCss": "string",
  "themeSettings": {},
  "metaTitle": "string",
  "metaDescription": "string",
  "metaKeywords": [
    "string"
  ],
  "ogImageUrl": "string",
  "analyticsSettings": {},
  "paymentLinks": [
    "string"
  ],
  "showSocialLinks": true,
  "showTestimonials": true,
  "showMediaGallery": true,
  "contactFormEnabled": true
}
Responses
Code	Description	Links
200	
Landing page updated successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "creatorId": "string",
  "pageType": "landing",
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "slug": "string",
  "isPublished": true,
  "pageMetadata": {},
  "heroTitle": "string",
  "heroSubtitle": "string",
  "heroDescription": "string",
  "heroImageUrl": "string",
  "heroBackgroundColor": "string",
  "heroTextColor": "string",
  "contentSections": [
    {}
  ],
  "ctaButtons": [
    {}
  ],
  "testimonials": [
    {}
  ],
  "socialProof": {},
  "mediaGallery": [
    {}
  ],
  "customCss": "string",
  "themeSettings": {},
  "metaTitle": "string",
  "metaDescription": "string",
  "metaKeywords": [
    "string"
  ],
  "ogImageUrl": "string",
  "analyticsSettings": {},
  "paymentLinks": [
    "string"
  ],
  "showSocialLinks": true,
  "showTestimonials": true,
  "showMediaGallery": true,
  "contactFormEnabled": true,
  "createdAt": "2025-09-15T07:41:00.765Z",
  "updatedAt": "2025-09-15T07:41:00.765Z"
}
No links
400	
Invalid request data

No links
401	
Unauthorized

No links
403	
Forbidden - can only update own landing pages

No links
404	
Landing page not found

No links
409	
Slug is already taken

No links
500	
Internal server error

No links

DELETE
/api/landing-pages/{id}
Delete a landing page


Parameters
Try it out
Name	Description
id *
string
(path)
Landing page ID

id
Responses
Code	Description	Links
200	
Landing page deleted successfully

No links
401	
Unauthorized

No links
403	
Forbidden - can only delete own landing pages

No links
404	
Landing page not found

No links
500	
Internal server error

No links

GET
/api/landing-pages/creator/{creatorId}
Get all landing pages for a creator


Parameters
Try it out
Name	Description
creatorId *
string
(path)
Creator ID

creatorId
published
boolean
(query)
Filter by published status


--
type
string
(query)
Filter by page type

Available values : landing, product, service, portfolio


--
Responses
Code	Description	Links
200	
Landing pages retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "landingPages": [
    {
      "id": "string",
      "creatorId": "string",
      "pageType": "landing",
      "title": "string",
      "subtitle": "string",
      "description": "string",
      "slug": "string",
      "isPublished": true,
      "pageMetadata": {},
      "heroTitle": "string",
      "heroSubtitle": "string",
      "heroDescription": "string",
      "heroImageUrl": "string",
      "heroBackgroundColor": "string",
      "heroTextColor": "string",
      "contentSections": [
        {}
      ],
      "ctaButtons": [
        {}
      ],
      "testimonials": [
        {}
      ],
      "socialProof": {},
      "mediaGallery": [
        {}
      ],
      "customCss": "string",
      "themeSettings": {},
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": [
        "string"
      ],
      "ogImageUrl": "string",
      "analyticsSettings": {},
      "paymentLinks": [
        "string"
      ],
      "showSocialLinks": true,
      "showTestimonials": true,
      "showMediaGallery": true,
      "contactFormEnabled": true,
      "createdAt": "2025-09-15T07:41:00.774Z",
      "updatedAt": "2025-09-15T07:41:00.774Z"
    }
  ],
  "total": 0
}
No links
400	
Invalid creator ID

No links
500	
Internal server error

No links

POST
/api/landing-pages/{id}/publish
Publish or unpublish a landing page


Parameters
Try it out
Name	Description
id *
string
(path)
Landing page ID

id
Request body

application/json
Example Value
Schema
{
  "isPublished": true
}
Responses
Code	Description	Links
200	
Landing page publish status updated successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "creatorId": "string",
  "pageType": "landing",
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "slug": "string",
  "isPublished": true,
  "pageMetadata": {},
  "heroTitle": "string",
  "heroSubtitle": "string",
  "heroDescription": "string",
  "heroImageUrl": "string",
  "heroBackgroundColor": "string",
  "heroTextColor": "string",
  "contentSections": [
    {}
  ],
  "ctaButtons": [
    {}
  ],
  "testimonials": [
    {}
  ],
  "socialProof": {},
  "mediaGallery": [
    {}
  ],
  "customCss": "string",
  "themeSettings": {},
  "metaTitle": "string",
  "metaDescription": "string",
  "metaKeywords": [
    "string"
  ],
  "ogImageUrl": "string",
  "analyticsSettings": {},
  "paymentLinks": [
    "string"
  ],
  "showSocialLinks": true,
  "showTestimonials": true,
  "showMediaGallery": true,
  "contactFormEnabled": true,
  "createdAt": "2025-09-15T07:41:00.778Z",
  "updatedAt": "2025-09-15T07:41:00.778Z"
}
No links
400	
Invalid request data

No links
401	
Unauthorized

No links
403	
Forbidden - can only modify own landing pages

No links
404	
Landing page not found

No links
500	
Internal server error

No links
Payment Links


POST
/api/payment-links
Create a new payment link


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "type": "tip",
  "title": "string",
  "description": "string",
  "price": 0,
  "currency": "NGN",
  "imageUrl": "string",
  "successMessage": "string",
  "isPublished": false
}
Responses
Code	Description	Links
201	
Payment link created successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "creatorId": "string",
  "type": "tip",
  "title": "string",
  "description": "string",
  "price": 0,
  "currency": "NGN",
  "imageUrl": "string",
  "successMessage": "string",
  "isPublished": true,
  "slug": "string",
  "totalRevenue": 0,
  "totalTransactions": 0,
  "createdAt": "2025-09-15T07:41:00.782Z",
  "updatedAt": "2025-09-15T07:41:00.782Z"
}
No links
400	
Invalid request data

No links
401	
Unauthorized

No links
403	
Creator profile not found

No links
500	
Internal server error

No links

GET
/api/payment-links/{id}
Get payment link by ID


Parameters
Try it out
Name	Description
id *
string
(path)
Payment link ID

id
Responses
Code	Description	Links
200	
Payment link retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "creatorId": "string",
  "type": "tip",
  "title": "string",
  "description": "string",
  "price": 0,
  "currency": "NGN",
  "imageUrl": "string",
  "successMessage": "string",
  "isPublished": true,
  "slug": "string",
  "totalRevenue": 0,
  "totalTransactions": 0,
  "createdAt": "2025-09-15T07:41:00.785Z",
  "updatedAt": "2025-09-15T07:41:00.785Z"
}
No links
404	
Payment link not found

No links
500	
Internal server error

No links

PUT
/api/payment-links/{id}
Update payment link


Parameters
Try it out
Name	Description
id *
string
(path)
Payment link ID

id
Request body

application/json
Example Value
Schema
{
  "type": "tip",
  "title": "string",
  "description": "string",
  "price": 0,
  "currency": "string",
  "imageUrl": "string",
  "successMessage": "string"
}
Responses
Code	Description	Links
200	
Payment link updated successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "creatorId": "string",
  "type": "tip",
  "title": "string",
  "description": "string",
  "price": 0,
  "currency": "NGN",
  "imageUrl": "string",
  "successMessage": "string",
  "isPublished": true,
  "slug": "string",
  "totalRevenue": 0,
  "totalTransactions": 0,
  "createdAt": "2025-09-15T07:41:00.788Z",
  "updatedAt": "2025-09-15T07:41:00.788Z"
}
No links
400	
Invalid request data

No links
401	
Unauthorized

No links
403	
Forbidden - can only update own payment links

No links
404	
Payment link not found

No links
500	
Internal server error

No links

GET
/api/creators/{creatorId}/payment-links
Get all payment links for a creator


Parameters
Try it out
Name	Description
creatorId *
string
(path)
Creator ID

creatorId
published
boolean
(query)
Filter by published status


--
type
string
(query)
Filter by payment link type

Available values : tip, membership, pay_per_view, rental, ticket, product


--
Responses
Code	Description	Links
200	
Payment links retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "paymentLinks": [
    {
      "id": "string",
      "creatorId": "string",
      "type": "tip",
      "title": "string",
      "description": "string",
      "price": 0,
      "currency": "NGN",
      "imageUrl": "string",
      "successMessage": "string",
      "isPublished": true,
      "slug": "string",
      "totalRevenue": 0,
      "totalTransactions": 0,
      "createdAt": "2025-09-15T07:41:00.792Z",
      "updatedAt": "2025-09-15T07:41:00.792Z"
    }
  ],
  "total": 0
}
No links
400	
Invalid creator ID

No links
500	
Internal server error

No links

POST
/api/payment-links/{id}/publish
Publish or unpublish a payment link


Parameters
Try it out
Name	Description
id *
string
(path)
Payment link ID

id
Request body

application/json
Example Value
Schema
{
  "isPublished": true
}
Responses
Code	Description	Links
200	
Payment link publish status updated successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "id": "string",
  "creatorId": "string",
  "type": "tip",
  "title": "string",
  "description": "string",
  "price": 0,
  "currency": "NGN",
  "imageUrl": "string",
  "successMessage": "string",
  "isPublished": true,
  "slug": "string",
  "totalRevenue": 0,
  "totalTransactions": 0,
  "createdAt": "2025-09-15T07:41:00.796Z",
  "updatedAt": "2025-09-15T07:41:00.796Z"
}
No links
400	
Invalid request data

No links
401	
Unauthorized

No links
403	
Forbidden - can only modify own payment links

No links
404	
Payment link not found

No links
500	
Internal server error

No links
Payment Methods


GET
/api/payment-methods/available
Get all available payment methods (fiat and crypto)


Parameters
Try it out
Name	Description
currency
string
(query)
Filter by specific currency

currency
type
string
(query)
Filter by payment type

Available values : fiat, crypto, all

Default value : all


all
Responses
Code	Description	Links
200	
Available payment methods retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "payment_methods": {
    "fiat": {
      "currencies": [
        {}
      ],
      "supported_methods": [
        "string"
      ]
    },
    "crypto": {
      "currencies": [
        "string"
      ],
      "supported_methods": [
        "string"
      ]
    },
    "combined": [
      {}
    ]
  },
  "services": [
    "string"
  ]
}
No links
500	
Internal server error

No links

GET
/api/payment-methods/currency-info/{currencyCode}
Get detailed information about a specific currency


Parameters
Try it out
Name	Description
currencyCode *
string
(path)
Currency code (e.g., USD, BTC, ETH)

currencyCode
Responses
Code	Description	Links
200	
Currency information retrieved successfully

No links
404	
Currency not found

No links
500	
Internal server error

No links

POST
/api/payment-methods/compare
Compare payment options for a specific amount


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "amount": 0,
  "currency": "string",
  "paymentLinkId": "string"
}
Responses
Code	Description	Links
200	
Payment options comparison retrieved successfully

No links
400	
Invalid request data

No links
500	
Internal server error

No links

GET
/api/payment-methods/supported-currencies
Get all supported currencies across all payment services


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Supported currencies retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "currencies": {
    "fiat": [
      {}
    ],
    "crypto": [
      "string"
    ],
    "all": [
      {}
    ]
  },
  "total_count": 0
}
No links
500	
Internal server error

No links
Payments


POST
/api/payments/initiate
Initiate payment for a payment link with customer currency choice


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "paymentLinkId": "string",
  "customerEmail": "user@example.com",
  "customerName": "string",
  "customerCurrency": "string",
  "redirectUrl": "string"
}
Responses
Code	Description	Links
200	
Payment initiated successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "payment_url": "string",
  "reference": "string",
  "transaction_id": "string",
  "paymentLink": {
    "id": "string",
    "title": "string",
    "originalPrice": 0,
    "originalCurrency": "string",
    "convertedPrice": 0,
    "customerCurrency": "string",
    "exchangeRate": 0,
    "successMessage": "string"
  }
}
No links
400	
Invalid request data

No links
404	
Payment link not found or not published

No links
500	
Internal server error

No links

GET
/api/payments/verify/{transactionId}
Verify payment transaction


Parameters
Try it out
Name	Description
transactionId *
string
(path)
Flutterwave transaction ID to verify

transactionId
Responses
Code	Description	Links
200	
Payment verification result

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "verified": true,
  "message": "string",
  "transaction": {}
}
No links
400	
Invalid transaction ID

No links
500	
Internal server error

No links

POST
/api/payments/webhook
Handle Flutterwave webhook


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{}
Responses
Code	Description	Links
200	
Webhook processed successfully

No links
400	
Invalid webhook signature

No links
500	
Webhook processing error

No links

POST
/api/payments/convert-link-price
Convert payment link price to customer's preferred currency


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "paymentLinkId": "string",
  "customerCurrency": "string"
}
Responses
Code	Description	Links
200	
Price conversion successful

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "conversion": {
    "paymentLinkId": "string",
    "originalPrice": 0,
    "originalCurrency": "string",
    "convertedPrice": 0,
    "customerCurrency": "string",
    "exchangeRate": 0,
    "formattedPrice": "string",
    "supportedPaymentMethods": [
      "string"
    ]
  }
}
No links
400	
Invalid request data or unsupported currency

No links
404	
Payment link not found

No links
500	
Internal server error

No links

GET
/api/payments/link/{slug}
Get payment link details by slug (public endpoint)


Parameters
Try it out
Name	Description
slug *
string
(path)
Payment link slug

slug
Responses
Code	Description	Links
200	
Payment link details retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "paymentLink": {
    "id": "string",
    "title": "string",
    "description": "string",
    "price": 0,
    "currency": "string",
    "imageUrl": "string",
    "successMessage": "string",
    "creator": {
      "name": "string",
      "bio": "string",
      "socialLinks": [
        "string"
      ],
      "jaraPageSlug": "string"
    }
  }
}
No links
404	
Payment link not found or not published

No links
500	
Internal server error

No links
Public Pages


GET
/api/pages/{slug}
Get public landing page data by slug


Parameters
Try it out
Name	Description
slug *
string
(path)
Page slug

slug
Responses
Code	Description	Links
200	
Page data retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "page": {
    "id": "string",
    "creator": {
      "id": "string",
      "name": "string",
      "bio": "string",
      "socialLinks": [
        "string"
      ],
      "jaraPageSlug": "string"
    },
    "pageData": {},
    "paymentLinks": [
      {}
    ]
  }
}
No links
404	
Page not found or not published

No links
500	
Internal server error

No links

POST
/api/pages/{slug}/payment
Initialize payment for a page by slug


Parameters
Try it out
Name	Description
slug *
string
(path)
Page slug

slug
Request body

application/json
Example Value
Schema
{
  "paymentLinkSlug": "string",
  "customerEmail": "user@example.com",
  "customerName": "string",
  "paymentMethod": "flutterwave",
  "currency": "string"
}
Responses
Code	Description	Links
200	
Payment initialized successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "paymentData": {},
  "paymentUrl": "string"
}
No links
400	
Invalid request data

No links
404	
Page or payment link not found

No links
500	
Internal server error

No links

GET
/api/pages/{slug}/payment-links
Get available payment links for a page


Parameters
Try it out
Name	Description
slug *
string
(path)
Page slug

slug
Responses
Code	Description	Links
200	
Payment links retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "paymentLinks": [
    {
      "id": "string",
      "type": "string",
      "title": "string",
      "description": "string",
      "price": 0,
      "currency": "string",
      "imageUrl": "string",
      "slug": "string"
    }
  ]
}
No links
404	
Page not found

No links
500	
Internal server error

No links

Schemas
Creator
CreatorLandingPage
PaymentLink





GET
/api/dashboard/creator/{creatorId}/quick-links
Get quick action links for creator dashboard


Images


POST
/api/images/upload
Upload an image to Supabase storage


Parameters
Try it out
No parameters

Request body

multipart/form-data
image
string($binary)
Image file to upload

folder
string
Storage folder for the image

altText
string
Alt text for accessibility

Responses
Code	Description	Links
201	
Image uploaded successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "imageUrl": "string",
  "imageId": "string",
  "fileName": "string",
  "fileSize": 0,
  "mimeType": "string"
}
No links
400	
Invalid request or file

No links
401	
Unauthorized

No links
413	
File too large

No links
415	
Unsupported file type

No links
500	
Internal server error

No links

POST
/api/images/upload/profile-picture
Upload a profile picture for the authenticated user


Parameters
Try it out
No parameters

Request body

multipart/form-data
image
string($binary)
Profile picture image file

Responses
Code	Description	Links
201	
Profile picture uploaded successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "imageUrl": "string",
  "message": "string"
}
No links
400	
Invalid request or file

No links
401	
Unauthorized

No links
403	
Creator profile not found

No links
500	
Internal server error

No links

GET
/api/images/{imageId}
Get image metadata by ID


Parameters
Try it out
Name	Description
imageId *
string
(path)
Image ID

imageId
Responses
Code	Description	Links
200	
Image metadata retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "image": {
    "id": "string",
    "url": "string",
    "fileName": "string",
    "fileSize": 0,
    "mimeType": "string",
    "folder": "string",
    "altText": "string",
    "uploadedAt": "string"
  }
}
No links
404	
Image not found

No links
500	
Internal server error

No links

DELETE
/api/images/{imageId}
Delete an image


Parameters
Try it out
Name	Description
imageId *
string
(path)
Image ID

imageId
Responses
Code	Description	Links
200	
Image deleted successfully

No links
401	
Unauthorized

No links
403	
Forbidden - can only delete own images

No links
404	
Image not found

No links
500	
Internal server error

No links

GET
/api/images/user/{userId}
Get all images uploaded by a user


Parameters
Try it out
Name	Description
userId *
string
(path)
User ID

userId
folder
string
(query)
Filter by folder

Available values : profiles, payment-links, landing-pages, general


--
limit
integer
(query)
Number of images to return

Default value : 20

20
offset
integer
(query)
Offset for pagination

Default value : 0

0
Responses
Code	Description	Links
200	
Images retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "images": [
    {}
  ],
  "total": 0
}
No links
500	
Internal server error

No links
Jara Pages





GET
/api/creators/me
Get current user's creator profile


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Creator profile retrieved successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "creator": {
    "id": "string",
    "user_id": "string",
    "display_name": "string",
    "bio": "string",
    "profile_picture_url": "string",
    "jara_page_slug": "string",
    "landing_page_metadata": {},
    "created_at": "2025-09-15T08:49:01.120Z",
    "updated_at": "2025-09-15T08:49:01.120Z"
  }
}
No links
401	
Unauthorized

No links
404	
Creator profile not found

No links
500	
Internal server error