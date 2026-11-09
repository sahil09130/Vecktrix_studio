import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";

/**
 * TODO: send the enquiry by email. Add these env variables (e.g. in .env.local
 * and in your hosting provider) and call your email service below:
 *
 *   CONTACT_TO_EMAIL     where enquiries are delivered
 *   CONTACT_FROM_EMAIL   verified sender address
 *   RESEND_API_KEY       (or SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 *
 * For now the validated enquiry is logged on the server and success is returned.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots do not retry.
  if (body && typeof body === "object" && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", errors: result.errors },
      { status: 422 },
    );
  }

  console.log("[contact] new enquiry", result.data);
  return NextResponse.json({ ok: true });
}
