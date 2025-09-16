# AI Landing Page Generation - Frontend Documentation

## Overview

The AI landing page generation feature allows creators to generate complete landing pages using Google's Gemini AI. The AI analyzes text prompts and images to create professional landing pages with integrated payment links and media content.

## Endpoints

### Generate Landing Page
**POST** `/api/ai/landing-pages/generate`

Generates a complete landing page from text prompts and images.

#### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "prompt": "Create a landing page for my photography business offering portrait sessions",
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  ],
  "pageType": "portfolio",
  "targetAudience": "Professional photographers and families",
  "tone": "professional"
}
```

#### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the landing page to generate |
| `images` | array | No | Array of base64 encoded images (max 5 images) |
| `pageType` | string | No | Type of page: "landing", "product", "service", "portfolio" |
| `targetAudience` | string | No | Description of target audience |
| `tone` | string | No | Content tone: "professional", "casual", "friendly", "formal", "creative" |

#### Image Upload Format

Images must be provided as base64 encoded strings with proper MIME type prefix:

```javascript
// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Usage
const imageFile = event.target.files[0];
const base64Image = await fileToBase64(imageFile);
// Result: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
```

#### Response
```json
{
  "success": true,
  "message": "Landing page generated successfully",
  "landingPage": {
    "id": "uuid",
    "creator_id": "uuid",
    "title": "Photography Portfolio",
    "slug": "creator-slug-photography-portfolio",
    "is_published": false,
    "hero_title": "Professional Photography Services",
    "hero_description": "Capturing life's precious moments",
    "content_sections": [...],
    "cta_buttons": [...],
    "theme_settings": {...},
    "payment_links": ["payment-link-slug-1", "payment-link-slug-2"],
    "created_at": "2025-09-16T03:00:00.000Z"
  },
  "generatedPaymentLinks": [
    {
      "id": "uuid",
      "slug": "creator-slug-portrait-session",
      "title": "Portrait Session",
      "price": 15000,
      "currency": "NGN",
      "type": "product"
    }
  ]
}
```

### Get Generation Templates
**GET** `/api/ai/landing-pages/templates`

Returns predefined prompt templates for different page types.

#### Response
```json
{
  "success": true,
  "templates": [
    {
      "name": "Product Launch",
      "description": "Perfect for launching a new product or service",
      "prompt": "Create a landing page for launching a new innovative product...",
      "pageType": "product",
      "targetAudience": "Tech-savvy consumers",
      "tone": "professional"
    }
  ]
}
```

## Frontend Implementation Examples

### React Component Example

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const AILandingPageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    const base64Images = await Promise.all(
      files.map(file => fileToBase64(file))
    );

    setImages(prev => [...prev, ...base64Images]);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const generateLandingPage = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/landing-pages/generate', {
        prompt,
        images,
        pageType: 'landing',
        targetAudience: 'General audience',
        tone: 'professional'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setResult(response.data);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="ai-generator">
      <h2>AI Landing Page Generator</h2>

      <div className="form-group">
        <label>Describe your landing page:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Create a landing page for my freelance graphic design services..."
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Upload images (optional):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />

        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image} alt={`Preview ${index + 1}`} width="100" />
              <button onClick={() => removeImage(index)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={generateLandingPage}
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Generating...' : 'Generate Landing Page'}
      </button>

      {result && (
        <div className="result">
          <h3>Generated Landing Page</h3>
          <p>Title: {result.landingPage.title}</p>
          <p>Slug: {result.landingPage.slug}</p>

          {result.generatedPaymentLinks.length > 0 && (
            <div>
              <h4>Created Payment Links:</h4>
              <ul>
                {result.generatedPaymentLinks.map(link => (
                  <li key={link.id}>
                    {link.title} - ₦{link.price}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AILandingPageGenerator;
```

### JavaScript Fetch Example

```javascript
// Convert file to base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Generate landing page
async function generateLandingPage(prompt, imageFiles) {
  const images = await Promise.all(
    imageFiles.map(file => fileToBase64(file))
  );

  const response = await fetch('/api/ai/landing-pages/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      prompt,
      images,
      pageType: 'landing',
      tone: 'professional'
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Generation failed');
  }

  return result;
}

// Usage
const imageInput = document.getElementById('image-input');
const promptInput = document.getElementById('prompt-input');

document.getElementById('generate-btn').addEventListener('click', async () => {
  try {
    const result = await generateLandingPage(
      promptInput.value,
      Array.from(imageInput.files)
    );

    console.log('Generated landing page:', result.landingPage);
    console.log('Payment links created:', result.generatedPaymentLinks);
  } catch (error) {
    console.error('Error:', error.message);
  }
});
```

## Error Handling

### Common Error Responses

```json
{
  "error": "Prompt is required and must be a non-empty string",
  "message": "Validation failed"
}
```

```json
{
  "error": "Creator profile required",
  "message": "You must create a creator profile before generating landing pages"
}
```

```json
{
  "error": "Failed to generate landing page",
  "message": "AI service temporarily unavailable"
}
```

### Error Codes
- `400`: Invalid request data
- `401`: Unauthorized (invalid/missing JWT token)
- `403`: Creator profile not found
- `500`: Internal server error

## Best Practices

1. **Prompt Quality**: Write detailed, specific prompts for better results
2. **Image Limits**: Maximum 5 images per request
3. **Image Formats**: Use JPEG, PNG, or WebP formats
4. **File Sizes**: Keep images under 5MB each for optimal performance
5. **Authentication**: Always include valid JWT token in requests
6. **Error Handling**: Implement proper error handling for network issues and API failures

## Rate Limiting

- Maximum 10 generation requests per hour per user
- Image uploads are subject to Supabase storage limits
- Large images may take longer to process

## Support

For issues with AI generation or API integration, check:
1. API documentation at `/api-docs`
2. Server logs for detailed error messages
3. Ensure all required fields are provided
4. Verify image formats and sizes