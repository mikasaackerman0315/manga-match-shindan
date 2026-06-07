import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function sanitizeText(value, maxLength = 3000) {
  return `${value || ""}`.replace(/\r/g, "").trim().slice(0, maxLength);
}

function isValidEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const name = sanitizeText(body.name, 80);
    const email = sanitizeText(body.email, 160);
    const subject = sanitizeText(body.subject, 120) || "マンガマッチ診断へのお問い合わせ";
    const message = sanitizeText(body.message, 3000);
    const pageUrl = sanitizeText(body.pageUrl, 500);
    const website = sanitizeText(body.website, 200);

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (message.length < 10) {
      return NextResponse.json({ error: "お問い合わせ内容を10文字以上で入力してください。" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "メールアドレスの形式を確認してください。" }, { status: 400 });
    }

    const smtpUser = process.env.GMAIL_SMTP_USER || process.env.SMTP_USER;
    const smtpPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    const to = process.env.CONTACT_EMAIL || "mangamatchquiz@gmail.com";

    if (!smtpUser || !smtpPass) {
      return NextResponse.json({ error: "メール送信設定が未完了です。" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const submittedAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    const text = [
      "マンガマッチ診断のお問い合わせフォームから送信されました。",
      "",
      `送信日時: ${submittedAt}`,
      `お名前: ${name || "未入力"}`,
      `メール: ${email || "未入力"}`,
      `件名: ${subject}`,
      pageUrl ? `送信ページ: ${pageUrl}` : "",
      "",
      "お問い合わせ内容:",
      message,
    ].filter(Boolean).join("\n");

    await transporter.sendMail({
      from: `"マンガマッチ診断" <${smtpUser}>`,
      to,
      replyTo: email || undefined,
      subject: `【マンガマッチ診断】${subject}`,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact mail error:", error);
    return NextResponse.json({ error: "送信中にエラーが発生しました。" }, { status: 500 });
  }
}
