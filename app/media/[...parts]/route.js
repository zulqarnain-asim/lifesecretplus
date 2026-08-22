import { getImage } from "../../../lib/db";

// /media/<id> and /media/<id>/<descriptive-name> both serve the same upload.
export async function GET(_request, { params }) {
  const { parts } = await params;
  const id = parts?.[0] || "";
  if (!/^\d+$/.test(id)) return new Response("Not found", { status: 404 });

  const image = await getImage(id);
  if (!image) return new Response("Not found", { status: 404 });

  return new Response(image.bytes, {
    headers: {
      "Content-Type": image.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
