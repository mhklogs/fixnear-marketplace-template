export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Send a conversation to the server-side Gemini endpoint. */
export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });
    if (!res.ok) {
      throw new Error(`chat request failed: ${res.status}`);
    }
    const data = await res.json();
    return data.reply as string;
  } finally {
    clearTimeout(timer);
  }
}
