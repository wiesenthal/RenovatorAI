# RenovatorAI Learnings

## Project Setup
- Using Next.js 16 with App Router
- FAL AI with Seedream 4.5 model for image editing
- Tailwind CSS for styling

## API Details
- Seedream 4.5 edit endpoint: `fal-ai/bytedance/seedream/v4.5/edit`
- Requires FAL_KEY in .env
- Input takes `image_urls` (list of URLs) and `prompt`
- **IMPORTANT**: Base64 data URLs don't work directly - must upload to FAL storage first using `fal.storage.upload()`

## Deployment
- Ready for Vercel deployment
- Environment variable FAL_KEY must be set in Vercel dashboard
