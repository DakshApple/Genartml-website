# Blog articles. Author on every post: Team Genartml.

ARTICLES = [
dict(
slug="how-a-voice-ai-agent-handles-a-messy-phone-call",
cat="AI Voice Agents",
title="How a voice AI agent handles a messy real-world phone call",
dek="Demos are clean. Real calls have traffic noise, half-heard numbers, callers who switch to Hindi mid-sentence and people who want a price. Here is what has to happen, step by step, for an agent to get through one.",
date="2026-10-19", date_h="19 October 2026", read=9, cover="voice",
body="""
<p>Every voice AI demo sounds good. A quiet room, a patient caller, a clear question with one answer. The calls a business actually gets are different. The caller is on a two-wheeler. They say a date as "parso" and a budget as "sixty-seventy". They interrupt halfway through a sentence, ask for the manager, and then want to know the price before anything else.</p>
<p>This is a practical breakdown of what a voice agent has to do on a call like that, and the rules we build into every agent so it behaves well when the call goes off script. None of it needs a research lab. It needs careful rules and a lot of testing.</p>

<h2 id="pipeline">The pipeline in one breath</h2>
<p>A phone call to an AI agent passes through five pieces, every turn, in about a second:</p>
<div class="pipeline"><span>Phone line</span><i></i><span>Speech to text</span><i></i><span>Language model, rules and tools</span><i></i><span>Text to speech</span><i></i><span>Back on the line</span></div>
<p>Each hop adds delay and each can get something wrong. The speech-to-text step can mishear. The model can say too much. The voice can mispronounce a number. Most of the engineering is about making each step fail safely instead of failing loudly.</p>

<h2 id="hearing">Step 1. Hearing through noise</h2>
<p>The agent never hears audio. It reads a transcript that a speech system produced from the audio, and that transcript is often wrong in small ways. A name comes out as a different name. "Fifteen" becomes "fifty".</p>
<p>So the agent needs a rule for what to do with a garbled word, and the rule depends on how much the word matters:</p>
<ul>
<li><strong>Small words, meaning still clear:</strong> carry on. Never repeat the garbled version back, because that tells the caller you did not understand.</li>
<li><strong>Things that matter:</strong> an amount, a date or time, a name, an address, which option they chose, or a yes or no to the next step. Here the agent does not guess. It says it could not hear clearly and asks once more.</li>
</ul>
<p>One wrong guess on a date costs more than one repeated question. That trade-off sits at the heart of a good agent.</p>

<h2 id="turns">Step 2. Short turns, one question at a time</h2>
<p>People on a phone cannot scroll back. A paragraph goes over their head, and a list of three questions gets one answer. Every turn the agent speaks should carry one thing, in plain words, with at most one number, and then stop.</p>
<div class="dialog">
<p><b>Too long</b><span>Tell me what you need help with, since when it has been happening, and whether you have spoken to us before?</span></p>
<p><b>Right</b><span>Okay. Tell me, what do you need help with?</span></p>
</div>
<p>Short turns also make interruptions easier. When the caller starts speaking, the agent stops. If they ask the same thing twice, they did not get it the first time, so the agent says it again in fewer, different words instead of repeating itself like a recording.</p>

<h2 id="language">Step 3. English, Hindi and Hinglish</h2>
<p>A large share of business calls in India move between languages within a sentence. The agent should follow the caller, not force a language on them. That works well today for English, Hindi and Hinglish. Other Indian languages and strong regional accents are improving but are not equally reliable yet, so we only promise them after testing with real callers.</p>
<p>There is a quieter problem too. Whatever the model writes, the voice reads out exactly. So the agent's replies are written for the ear, not the eye:</p>
<ul>
<li>Numbers are written in words, because "10:30" can come out as "ten colon thirty".</li>
<li>No lists, brackets or symbols, because the voice stumbles on them.</li>
<li>A question ends with a question mark, because that is the only thing that makes the voice lift its pitch.</li>
</ul>

<h2 id="limits">Step 4. Questions it must not answer</h2>
<p>The most dangerous answer an agent can give is a confident wrong one. An invented price or an invented delivery date sounds exactly as believable as a real one. So every agent we build has a short list of things it never makes up: prices, discounts, dates, statuses, policies and client names that were not given to it.</p>
<p>When a caller asks for one of those, the agent gives the approved answer once, for example that the team confirms a fixed price after understanding the requirement, and then goes back to where the call was. It does not say "it depends" and stop.</p>
<blockquote>Making an agent talk is easy now. Making it stay inside its rules on every call is the actual work.</blockquote>

<h2 id="scenarios">Step 5. The calls that go off script</h2>
<p>Most turns need no special handling. A handful of situations come up often enough that each gets its own rule, written down with the reason behind it:</p>
<ul>
<li><strong>They are busy right now.</strong> Offer exactly one callback at a time they choose, and end the call warmly. Pushing on loses the lead.</li>
<li><strong>"Is this a scam? How did you get my number?"</strong> Say plainly where the details came from and who is calling. A clear, honest answer rebuilds trust fastest.</li>
<li><strong>They want the manager or the owner.</strong> Ask whether that person can speak now, and if not, offer a callback. Qualifying someone who cannot decide wastes both sides' time.</li>
<li><strong>They already have a developer.</strong> Ask whether there is anything not covered. If not, thank them and end the call. Never criticise the other team.</li>
<li><strong>They are upset about the call.</strong> Acknowledge it in one line and offer to call another time.</li>
<li><strong>Wrong number, a clear no, or abuse.</strong> One short polite line, then end the call.</li>
</ul>

<h2 id="honesty">Step 6. Honesty rules that never bend</h2>
<p>A few rules apply to every agent regardless of the business it works for:</p>
<ul>
<li>If someone sincerely asks whether they are speaking to a person or an AI, the agent says it is an AI assistant, in one line, and carries on.</li>
<li>It never claims to have done something it cannot do, such as "I have sent you the details", because the caller then waits for something that never arrives.</li>
<li>It never asks for, accepts or repeats an OTP, a PIN, a password or a card number. If a caller starts reading one out, it stops them. That is exactly what a scam sounds like.</li>
</ul>

<h2 id="after">Step 7. What happens after the call</h2>
<p>The call is half the job. The other half is what lands in your systems when it ends. Depending on the package, that is a summary of the call, the fields the caller gave (name, need, budget, preferred time) written into a sheet or CRM, a booking on a calendar, a WhatsApp follow-up to the caller, and a transfer or callback task for your team when a person needs to step in.</p>
<p>The test of a good agent is simple: can someone on your team read the log in ten seconds and know exactly what to do next?</p>

<h2 id="testing">How we test before go-live</h2>
<p>Before an agent takes a real call, we run it against a written list of hard calls: noise, interruptions, language switches, price questions, the scam question, a caller reading out a card number. We listen to the recordings, change one rule at a time and run the list again. During the build you get a test number every Friday so you can call it yourself.</p>
<div class="callout"><span class="label">Running costs</span>A voice agent costs money every minute it talks. You can pay the calling platform directly at its own rate, or we bill minutes at a fixed rate. Either way the number is written into the proposal before you start.</div>
"""),
dict(
slug="ai-agents-explained-for-indian-businesses",
cat="AI Systems",
title="AI agents explained: what they can actually do for an Indian business",
dek="A chatbot answers. A workflow follows steps. An agent decides the next step itself. What that difference means for a business, five jobs agents can do today, and where they still fall short.",
date="2026-10-19", date_h="19 October 2026", read=7, cover="agents",
body="""
<p>Almost every enquiry we get this year has the word "agent" in it. A distributor wants one. A clinic has heard one can replace a receptionist. A coaching institute wants one that teaches. Most of them mean different things, and most of what is written online is either trying to scare people or sell them something.</p>
<p>We build agents for our own products and for businesses, so we see up close what works and what breaks. This is a plain explanation of what an AI agent is, what it can do for an Indian business today, and where you should not trust it yet.</p>

<h2 id="what">What an AI agent actually is</h2>
<p>Three different things get called "AI" today, and the difference matters when you are paying for one.</p>
<ul>
<li>A <strong>chatbot</strong> answers questions. You type, it replies. Nothing happens after the conversation ends.</li>
<li>A <strong>workflow</strong> follows fixed steps. When a form is filled, send this message, add this row, alert this person. It is reliable, but it cannot handle anything it was not told about in advance.</li>
<li>An <strong>agent</strong> is given a goal, a set of tools and some rules, and it decides the steps itself. It can read a message, work out what the person needs, look something up, update your software, reply, and pass the case to a person when it is unsure.</li>
</ul>
<p>A simple test: if the software has to decide what to do next based on what just happened, it is an agent. If it only follows a script, it is a workflow. Both are useful. Many good systems are mostly workflow, with an agent at the one step that needs judgement.</p>

<h2 id="why-now">Why this is practical now</h2>
<p>Three things changed in the last few years. Models now use tools reliably: they can call your software, read the result and decide the next step many times in a row. Voice became good enough to hold a phone conversation, including callers who switch between Hindi and English mid-sentence. And the cost per task fell far enough that a small business can run an agent on real work every day, not just in a demo.</p>

<h2 id="five-jobs">Five jobs an agent can do today</h2>
<h3>1. Talk on the phone, in the language your customer speaks</h3>
<p>A voice agent can answer or make calls, ask one question at a time, book an appointment and log the call. The hard part is not making it talk. It is making it stay inside its rules on every call: never quoting a price it was not given, never promising a date, and handing over to a person when it should. We wrote up <a href="/blog/how-a-voice-ai-agent-handles-a-messy-phone-call/">how that works on a messy call</a>.</p>
<h3>2. Read documents so nobody has to type them</h3>
<p>Invoices, GST bills, purchase orders, delivery challans, KYC forms. An agent can read the PDF or the WhatsApp photo, pull out the fields, check them against what it expects and put them into Excel, Tally or your own software. When a GSTIN is in the wrong format or a total does not add up, it flags it instead of guessing.</p>
<h3>3. Answer from your own information</h3>
<p>An assistant that answers only from your price list, policies and product sheets, on WhatsApp or your website. A customer asks about stock or warranty at 11pm and gets a correct reply. When the question is outside what it knows, it says so and hands over to your team. This is the use case that works most reliably today, because the information is yours and the scope is clear.</p>
<h3>4. Run the reports nobody has time for</h3>
<p>An agent can pull numbers from your systems each morning, compare them with last week and send the owner a short note: collections are behind, this order is slipping, this expense doubled. It does not replace your accountant. It makes sure you see the problem on day two, not at month end.</p>
<h3>5. Teach and test at the student's pace</h3>
<p>We build education products, Evoluter for UPSC aspirants and Extuter for JEE and NEET students. Education is where agents may change the most in India, because one good teacher cannot sit with every student. An agent can explain a concept again in simpler words and pick the next question based on the last mistake.</p>

<h2 id="limits">Where agents still fall short</h2>
<ul>
<li><strong>They make mistakes with confidence.</strong> Every agent we build answers only from approved information and hands over when unsure. If someone sells you an agent with no handover, walk away.</li>
<li><strong>Indian languages are uneven.</strong> English, Hindi and Hinglish work well. Other languages, strong accents and noisy lines are improving but are not equally reliable yet.</li>
<li><strong>Old software is the real bottleneck.</strong> An agent is only as useful as the systems it can reach. If your data lives in a register or one person's head, that has to be fixed first.</li>
<li><strong>They cost money to run.</strong> Phone minutes, WhatsApp messages and model usage are charged per use. It is usually small, but you should know the number before you start.</li>
<li><strong>Your data needs care.</strong> Customer data handled by an agent falls under India's Digital Personal Data Protection Act. Know where your data is stored and which AI providers see it.</li>
</ul>

<h2 id="start">How to start without wasting money</h2>
<p>Pick one job that happens many times a day, follows a pattern and costs real hours. Enquiry response and document entry are the usual winners. Build that one thing, measure it for a month, then decide what is next. A single workflow with one AI step has a fixed price and delivery date, which is a cheaper way to learn than a large project that tries to do everything at once.</p>
"""),
dict(
slug="what-goes-into-a-fixed-scope-proposal",
cat="Engineering Process",
title="What goes into a fixed-scope proposal, and why it protects you",
dek="Hourly billing rewards the builder for taking longer. A fixed scope moves that risk to us. Here is exactly what our written proposals contain, and how changes are handled after you sign.",
date="2026-10-19", date_h="19 October 2026", read=6, cover="scope",
body="""
<p>Most software projects that go wrong do not fail because of code. They fail because nobody wrote down what "done" means. The client expected one thing, the developer built another, and the hourly bill kept running while both sides argued about it.</p>
<p>Every Genartml project starts with a written, fixed-scope proposal, sent within 48 hours of the discovery call. This is what goes into it, and why each part is there.</p>

<h2 id="deliverables">1. The deliverables, named one by one</h2>
<p>Not "a CRM integration" but "new website enquiries create a lead in your CRM with name, phone, source and message, and the assigned salesperson gets a WhatsApp alert". Each deliverable is written so that you and we can both look at the finished system and agree whether it does that thing.</p>

<h2 id="exclusions">2. What is not included</h2>
<p>A scope is only as useful as its edges. Every proposal lists what we are not building, so nothing is assumed. If it is not on the list of deliverables, it is not in the price, and you know that before you pay anything.</p>

<h2 id="price">3. One price, and how it is paid</h2>
<p>One number for the agreed scope, in rupees before GST for clients in India and in US dollars for international clients. Smaller packages are paid 50% to start and 50% on go-live. Larger projects are paid 40% to start, 40% when you sign off the test version and 20% on go-live. Enterprise work is split into phases, each with its own fixed price.</p>

<h2 id="timeline">4. A delivery date in working days</h2>
<p>Delivery is counted in working days, Monday to Saturday excluding public holidays, from the day the first payment clears and your content and access are ready. If content, access or feedback from your side is more than 5 working days late, the date moves by the same number of days. The price does not.</p>

<h2 id="running">5. Running costs, written out</h2>
<p>Hosting, AI usage, calling minutes and WhatsApp messages cost money every month. The proposal lists each one and who pays it. Wherever possible they are billed to you directly by the provider at its own price, so our fee never changes because your usage grows.</p>

<h2 id="weekly">6. A test link every Friday</h2>
<p>You do not wait until the end to see the work. Every Friday there is a live test link with what has been built that week. Feedback goes into the next week's build, which is how most surprises get caught while they are still cheap to fix.</p>

<h2 id="changes">7. How changes are handled</h2>
<p>Requirements change. That is normal. When you ask for something outside the signed scope, we quote it as a fixed-price change request with its own delivery time, and it starts only after your written approval. The original price and date stay as they were. A change in scope never turns into an hourly charge.</p>

<h2 id="handover">8. Ownership and support</h2>
<p>Full ownership of the code, designs, content and data passes to you on final payment. Every package includes free bug fixes for 30, 60 or 90 days from go-live, and the founder reviews every project before it goes live.</p>
<div class="callout"><span class="label">In short</span>If something takes us longer than we planned, that is our cost. If you want something new, you see its price before it starts. That is the whole idea behind a fixed scope.</div>
"""),
]
