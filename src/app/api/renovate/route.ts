import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

// Convert base64 data URL to blob and upload to FAL storage
async function uploadToFal(dataUrl: string): Promise<string> {
  // If it's already a URL, return it
  if (dataUrl.startsWith("http")) {
    return dataUrl;
  }

  // Extract base64 data and mime type
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid data URL format");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");
  const blob = new Blob([buffer], { type: mimeType });
  const file = new File([blob], "image.png", { type: mimeType });

  // Upload to FAL storage
  const uploadedUrl = await fal.storage.upload(file);
  return uploadedUrl;
}

export async function POST(request: NextRequest) {
  try {
    const { image, prompt } = await request.json();

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      );
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: "FAL_KEY not configured" },
        { status: 500 }
      );
    }

    // Upload image to FAL storage
    const imageUrl = await uploadToFal(image);

    // Use Seedream 4.5 edit for renovation
    const result = await fal.subscribe("fal-ai/bytedance/seedream/v4.5/edit", {
      input: {
        image_urls: [imageUrl],
        prompt: `Renovate this room: ${prompt}. Interior design, professional photography, high quality, detailed`,
      },
      logs: true,
    });

    const resultImageUrl = result.data?.images?.[0]?.url;

    if (!resultImageUrl) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl: resultImageUrl });
  } catch (error) {
    console.error("Renovation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
