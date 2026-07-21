export default function GeminiChatButton({ lang = "English" }) {
  const gemUrl =
    "https://gemini.google.com/gem/1CaYthHSZqohvXApzHXXqA3atpqs6ZLR1?usp=sharing";

  const isArabic = lang === "Arabic";

  return (
    <a
      href={gemUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="gemini-chat-button"
      aria-label={
        isArabic
          ? "افتح المساعد الذكي"
          : "Open the AI assistant"
      }
      dir={isArabic ? "rtl" : "ltr"}
    >
      <span className="gemini-chat-icon" aria-hidden="true">
        ✦
      </span>

      <span className="gemini-chat-text">
        {isArabic ? "اسأل المساعد الذكي" : "Ask the AI Assistant"}
      </span>
    </a>
  );
}