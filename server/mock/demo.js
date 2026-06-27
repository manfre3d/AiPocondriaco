// Scripted demo responses used when OPENAI_API_KEY is not set.
// Simulates a realistic health conversation so the app can be demoed without a live API key.

const DEMO_STREAM_RESPONSES = [
  `<p>Hi! I'm <strong>AiPocondria</strong>, your personal AI health companion 🩺</p>
<p>Tell me a bit about yourself — your age, lifestyle, any symptoms you've noticed — and I'll start building your health profile and score in real time.</p>
<p>You can ask me about:</p>
<ul>
  <li><strong>Symptoms</strong> you're experiencing</li>
  <li><strong>Diet &amp; nutrition</strong> advice</li>
  <li><strong>Exercise</strong> and fitness</li>
  <li><strong>Sleep</strong> quality and habits</li>
</ul>
<p><em>⚕️ Note: I'm a demo assistant — always consult a doctor for medical decisions.</em></p>`,

  `<p>Thanks for sharing that! Based on what you've told me so far, here are a few observations:</p>
<ul>
  <li>🟡 <strong>Activity level</strong> — moderate activity is a great foundation. Aim for at least 150 minutes of moderate exercise per week (WHO guidelines).</li>
  <li>🟢 <strong>Hydration</strong> — staying well hydrated supports circulation, digestion, and cognitive function.</li>
  <li>🔴 <strong>Sleep</strong> — if you're getting less than 7–8 hours consistently, this is worth prioritising. Sleep deprivation is linked to higher cardiovascular risk.</li>
</ul>
<p>Your <strong>health score</strong> has been updated — keep chatting to refine it further!</p>
<p><em>⚕️ This is a scripted demo response. In production, GPT-4o analyses your specific inputs.</em></p>`,

  `<p>Great conversation so far! Here's a summary of your health profile:</p>
<ul>
  <li>🏃 <strong>Physical activity:</strong> Regular movement detected — well done!</li>
  <li>🍎 <strong>Diet:</strong> Consider increasing fibre intake (vegetables, legumes, whole grains).</li>
  <li>😴 <strong>Sleep:</strong> Aim for consistent sleep and wake times to improve sleep quality.</li>
  <li>💧 <strong>Hydration:</strong> Target 2–2.5L of water per day.</li>
</ul>
<p>Your <strong>AI avatar</strong> in the sidebar will evolve as I learn more about you. Click the image to see it full-size!</p>
<p><em>⚕️ Always seek professional medical advice for diagnosis or treatment.</em></p>`,

  `<p>Excellent — your profile is filling out nicely! A few personalised tips based on our conversation:</p>
<ol>
  <li>🧘 Try a 10-minute mindfulness session daily to reduce cortisol and improve focus.</li>
  <li>🚶 A 20-minute walk after meals can lower blood sugar spikes by up to 30%.</li>
  <li>🥗 Swap one processed snack per day for a handful of mixed nuts or fresh fruit.</li>
</ol>
<p>These small, consistent habits compound significantly over time.</p>
<p><em>⚕️ Demo mode — this conversation resets on logout. Sign in again to start fresh.</em></p>`,
];

const DEMO_USER_INFO = {
  Nome: "Demo",
  Età: "29",
  Peso: "72kg",
  Altezza: "1.76m",
  Sesso: "Non specificato",
  AttivitaFisica: "Camminata quotidiana",
  Alimentazione: "Equilibrata con qualche eccesso",
  Sonno: "Circa 7 ore per notte",
};

// Health score ramps up across the conversation to show the trend feature
const DEMO_HEALTH_SCORES = [65, 70, 74, 78];

// DiceBear generates a consistent cartoon avatar — works as a standard <img src>
const DEMO_IMAGE_URL =
  "https://api.dicebear.com/9.x/avataaars/svg?seed=AiPocondria&backgroundColor=b6e3f4&radius=12";

// Streams `text` as SSE chunks, simulating token-by-token delivery
async function streamText(res, text) {
  const chunks = text.match(/.{1,4}/gs) || [];
  for (const chunk of chunks) {
    res.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
    await new Promise((r) => setTimeout(r, 18));
  }
}

module.exports = { DEMO_STREAM_RESPONSES, DEMO_USER_INFO, DEMO_HEALTH_SCORES, DEMO_IMAGE_URL, streamText };
