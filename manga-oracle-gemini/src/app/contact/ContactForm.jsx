"use client";

import { useState } from "react";

const initialState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setNotice("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "送信できませんでした。時間をおいて再度お試しください。");
      }

      setForm(initialState);
      setStatus("sent");
      setNotice("お問い合わせを送信しました。ありがとうございます。");
    } catch (error) {
      setStatus("error");
      setNotice(error.message || "送信できませんでした。時間をおいて再度お試しください。");
    }
  };

  const inputStyle = {
    border: "1px solid rgba(10,10,10,0.18)",
    backgroundColor: "rgba(245,243,238,0.75)",
    color: "#0a0a0a",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.58)" }}>
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField("website", event.target.value)} />
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="contact-name">お名前</label>
        <input
          id="contact-name"
          type="text"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="w-full px-4 py-3 text-base outline-none"
          style={inputStyle}
          placeholder="例：山田 太郎"
          maxLength={80}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="contact-email">メールアドレス</label>
        <input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="w-full px-4 py-3 text-base outline-none"
          style={inputStyle}
          placeholder="返信が必要な場合に入力してください"
          maxLength={160}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="contact-subject">件名</label>
        <input
          id="contact-subject"
          type="text"
          value={form.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          className="w-full px-4 py-3 text-base outline-none"
          style={inputStyle}
          placeholder="例：掲載内容について"
          maxLength={120}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="contact-message">お問い合わせ内容</label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="min-h-[180px] w-full px-4 py-3 text-base leading-7 outline-none"
          style={inputStyle}
          placeholder="お問い合わせ内容を入力してください"
          required
          minLength={10}
          maxLength={3000}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full md:w-auto px-8 py-3 text-xs tracking-[0.22em] uppercase transition-all disabled:opacity-50"
        style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>

      {notice && (
        <p className="text-sm leading-7" style={{ color: status === "error" ? "#c0392b" : "#2f6f3e" }}>
          {notice}
        </p>
      )}
    </form>
  );
}
