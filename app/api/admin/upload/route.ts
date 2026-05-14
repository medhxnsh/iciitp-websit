import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { getApp, getStorageBucket } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure Firebase app is initialized (with storageBucket set)
  getApp();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const path = formData.get("path") as string | null;

  if (!file || !path) {
    return NextResponse.json({ error: "file and path are required" }, { status: 400 });
  }

  const bucketName = getStorageBucket();

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = getStorage().bucket(bucketName);
    const fileRef = bucket.file(path);

    await fileRef.save(buffer, { metadata: { contentType: file.type } });

    try {
      await fileRef.makePublic();
    } catch {
      // makePublic fails when uniform bucket-level access is enabled — fall back to signed URL
      const [signedUrl] = await fileRef.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });
      return NextResponse.json({ url: signedUrl });
    }

    return NextResponse.json({
      url: `https://storage.googleapis.com/${bucketName}/${path}`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] Firebase Storage error:", msg, "bucket:", bucketName);
    return NextResponse.json({ error: `Storage upload failed: ${msg}` }, { status: 500 });
  }
}
