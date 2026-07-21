
export default function GeminiChatButton() {
  const gemUrl = "https://gemini.google.com/gem/1CaYthHSZqohvXApzHXXqA3atpqs6ZLR1?usp=sharing";

  return (
    <a
      href={gemUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="gemini-chat-button"
      aria-label="Open our AI assistant"
    >
      <span className="gemini-chat-icon" aria-hidden="true">
        ✦
      </span>

      <span className="gemini-chat-text">
        اسأل المساعد الذكي
      </span>
    </a>
  );
}