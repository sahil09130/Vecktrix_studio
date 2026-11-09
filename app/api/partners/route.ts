import { NextResponse } from "next/server";
import { validatePartner } from "@/lib/partner-validation";

/**
 * TODO: deliver applications to the partner team and store them. Add these env
 * variables and call your email or CRM service below, the same as /api/contact:
 *
 *   PARTNER_TO_EMAIL     where applications are delivered
 *   PARTNER_FROM_EMAIL   verified sender address
 *   RESEND_API_KEY       (or SMTP settings), shared with /api/contact
 *
 * Until then a valid application is logged on the server and success is
 * returned, so the page never reports a delivery that did not happen.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot (hidden field "nickname"): bots fill it, people never see it.
  // Pretend success so bots do not retry.
  if (body && typeof body === "object" && (body as { nickname?: unknown }).nickname) {
    return NextResponse.json({ ok: true });
  }

  const result = validatePartner(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields.", errors: result.errors },
      { status: 422 },
    );
  }

  console.log("[partners] new application", { ...result.data, phone: "[redacted]" });
  return NextResponse.json({ ok: true });
}
