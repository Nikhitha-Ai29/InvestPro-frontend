// Each entry: array of keywords to match, and the response text
const chatbotRules = [
  {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'howdy'],
    response: `👋 Hello! Welcome to InvestPro!\n\nI'm your investment assistant. I can help you with:\n• SIP & Mutual Funds\n• Low-risk fund options\n• Beginner investing tips\n• Portfolio & returns\n\nWhat would you like to know? 😊`
  },
  {
    keywords: ['sip', 'systematic investment plan'],
    response: `📅 SIP (Systematic Investment Plan)\n\nA SIP lets you invest a fixed amount every month automatically.\n\n✅ Benefits:\n• Start with as low as ₹500/month\n• Rupee cost averaging reduces risk\n• Builds wealth through compounding\n• No need to time the market\n\n💡 Tip: Even ₹1,000/month for 10 years at 12% = ₹2.3 Lakhs!`
  },
  {
    keywords: ['mutual fund', 'mutual funds', 'what is mutual fund', 'mf'],
    response: `📦 Mutual Funds Explained\n\nA mutual fund pools money from many investors to buy stocks, bonds, or other assets.\n\n🗂️ Types:\n• Equity Funds – High risk, high return\n• Debt Funds – Low risk, stable return\n• Hybrid Funds – Mix of both\n\n✅ Why invest?\n• Managed by experts\n• Diversified automatically\n• Start with just ₹500`
  },
  {
    keywords: ['low risk', 'safe investment', 'safe fund', 'low risk fund', 'secure'],
    response: `🛡️ Low-Risk Fund Options\n\nIf you prefer safety over high returns:\n\n1. 💰 Debt Mutual Funds – Invest in bonds & govt securities\n2. 🏦 Liquid Funds – Like a savings account, very safe\n3. ⚖️ Balanced/Hybrid Funds – Mix of equity + debt\n4. 🏛️ HDFC Balanced Fund – 12.8% avg return, Low risk\n\n💡 Best for: Capital preservation with steady growth.`
  },
  {
    keywords: ['beginner', 'new to investing', 'start investing', 'how to invest', 'first investment', 'getting started'],
    response: `🌱 Beginner's Guide to Investing\n\nHere's how to get started:\n\nStep 1️⃣ – Set a goal (retirement, house, education)\nStep 2️⃣ – Start a SIP with ₹500–₹1,000/month\nStep 3️⃣ – Choose a low-risk fund first\nStep 4️⃣ – Increase amount as income grows\nStep 5️⃣ – Stay invested for at least 3–5 years\n\n✅ Golden Rule: Start early, stay consistent!`
  },
  {
    keywords: ['return', 'returns', 'profit', 'gain', 'how much return', 'expected return'],
    response: `📈 Expected Returns on Mutual Funds\n\nReturns vary by fund type:\n\n• 🔴 Equity Funds – 12%–18% per year (High risk)\n• 🟡 Hybrid Funds – 10%–14% per year (Medium risk)\n• 🟢 Debt Funds – 6%–9% per year (Low risk)\n\n💡 Example: ₹10,000/month SIP for 10 years at 12% = ₹23.2 Lakhs\n\n⚠️ Note: Past returns don't guarantee future results.`
  },
  {
    keywords: ['portfolio', 'my portfolio', 'investments', 'my investments'],
    response: `💼 Your Portfolio\n\nYou can track all your investments in the Portfolio section.\n\n📊 What you'll see:\n• Total amount invested\n• Expected maturity value\n• Fund-wise breakdown\n• SIP vs One-time investments\n\n👉 Go to: Sidebar → Portfolio\n\n💡 Tip: Diversify across 2–3 fund types for balanced growth.`
  },
  {
    keywords: ['explore', 'explore funds', 'which fund', 'best fund', 'top fund', 'recommend'],
    response: `🔍 Top Funds on InvestPro\n\n1. 📈 Axis Midcap Fund\n   Risk: High | Returns: 18.5% | Min: ₹500\n\n2. 🏢 Mirae Asset Large Cap\n   Risk: Medium | Returns: 14.2% | Min: ₹1,000\n\n3. ⚖️ HDFC Balanced Fund\n   Risk: Low | Returns: 12.8% | Min: ₹500\n\n👉 Go to: Sidebar → Explore Funds to invest now!`
  },
  {
    keywords: ['calculator', 'sip calculator', 'calculate', 'how much', 'maturity'],
    response: `🧮 SIP Calculator\n\nWant to know how much your investment will grow?\n\n👉 Go to: Sidebar → SIP Calculator\n\nYou can enter:\n• Monthly investment amount\n• Expected rate of return (%)\n• Duration (years)\n\nAnd instantly see your estimated maturity amount! 💰`
  },
  {
    keywords: ['risk', 'risky', 'market risk', 'volatility'],
    response: `⚠️ Understanding Investment Risk\n\nAll investments carry some risk. Here's a quick guide:\n\n🔴 High Risk – Equity/Midcap Funds\n   Volatile but high long-term returns\n\n🟡 Medium Risk – Hybrid Funds\n   Balanced between growth & safety\n\n🟢 Low Risk – Debt/Liquid Funds\n   Stable returns, capital protected\n\n💡 Rule of thumb: Higher the risk → Higher the potential reward.`
  },
  {
    keywords: ['tax', 'taxation', 'ltcg', 'stcg', 'tax saving', 'elss'],
    response: `🧾 Tax on Mutual Funds\n\n📌 Equity Funds:\n• Short-term (<1 yr): 15% tax (STCG)\n• Long-term (>1 yr): 10% tax above ₹1L (LTCG)\n\n📌 Debt Funds:\n• Taxed as per your income slab\n\n💡 Tax Saving Option:\n• ELSS Funds – Save up to ₹1.5L under Section 80C\n• Lock-in period: 3 years (shortest among 80C options)`
  },
  {
    keywords: ['logout', 'log out', 'sign out'],
    response: `🚪 To logout, click the "Logout" button at the bottom of the sidebar.\n\nSee you next time! 👋`
  },
  {
    keywords: ['profile', 'my profile', 'account', 'my account'],
    response: `👤 Your Profile\n\nYou can view and edit your profile details:\n• Name\n• Email\n• Role\n• Risk Preference\n• Investment Goal\n\n👉 Go to: Sidebar → Profile`
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'great', 'awesome', 'helpful'],
    response: `😊 You're welcome! Happy to help.\n\nFeel free to ask me anything about:\n• Mutual Funds & SIP\n• Investment tips\n• Fund recommendations\n\nHappy investing! 🚀`
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'take care'],
    response: `👋 Goodbye! Have a great day!\n\nRemember: Stay invested, stay consistent. See you soon! 😊`
  }
];

export const getResponse = (input) => {
  const msg = input.toLowerCase().trim();
  for (const rule of chatbotRules) {
    if (rule.keywords.some(keyword => msg.includes(keyword))) {
      return rule.response;
    }
  }
  return `🤔 I'm not sure about that.\n\nYou can ask me about:\n• SIP & Mutual Funds\n• Low-risk fund options\n• Beginner investing tips\n• Returns & portfolio\n• Tax on investments\n\nTry asking something like "What is SIP?" or "Best fund for beginners" 😊`;
};
