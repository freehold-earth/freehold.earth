Every search, message, photo and purchase says something about you. Put together, those traces become your context: who you are, what you care about, who you spend time with, what you are likely to do next. It is the most valuable thing about you online. Right now, you are not the one who holds it.

## The context economy

Large platforms gather your context, combine it and put it to work. It shapes what you see, what you are offered and what you pay. Increasingly it trains the AI systems that will sit between you and almost everything you do online.

AI assistants make this sharper. An assistant is only as useful as what it knows about you, so the companies building them want to hold your context for you, then rent it back as a subscription. Each year you are a little more locked in, because everything that makes the assistant useful lives on their side.

Context is not one thing, either. You are a different person at work, with your family, with your doctor and with your friends. The context economy flattens all of that into a single profile you never see and cannot correct.

Privacy policies were meant to protect us. Nobody reads them, they change whenever it suits, and at best they are promises. We do not need better policies. We need better physics: rules that cannot be broken, rather than rules we hope are kept.

## Freehold, not leasehold

In property, a leaseholder lives somewhere on someone else's terms. The landlord sets the rules, can raise the rent and can, in the end, take it back. A freeholder owns the ground outright.

Today we are all leaseholders of our own lives online. Freehold is a way to hold your context outright: on your own devices, worked on by your own AI, shared only on your terms, and supported by infrastructure your community owns.

It rests on three ideas.

### Your data stays home

Your context lives encrypted on devices you control: your phone, your laptop, a small server at home, or a machine run by your community. It works when you are offline. Nothing about your life has to sit in a datacentre you will never see, owned by a company whose interests are not yours.

### Your own AI

Capable open AI models now run on ordinary laptops, and they are reaching phones. That changes everything. An assistant can learn from your whole context without that context ever leaving your hands, because the assistant is yours. You choose which open model it uses, and it reports to no one.

### Rules as maths, not promises

When a service wants something from you, your rules decide what it gets. Freehold describes those rules in an open, machine-readable policy language called S-PAL: what may be shared, with whom, for how long, and for what purpose.

Often a service does not need your data at all, only a fact about it. A shop needs to know you are over 21, not your date of birth. With zero-knowledge proofs your device can prove the fact and reveal nothing else. Where rules need to be enforced beyond your own device, Freehold uses public cryptographic networks as an anchor, never as a home: your data does not live there, and your life does not stop if a network has a bad day.

## The datacentre is yours

Most people should never have to run a server. But the alternative cannot be handing everything back to the same few companies.

There is a middle path that people already know how to build. Communities run their own networks, their own energy schemes and their own credit unions. They can run their own data infrastructure too. A Freehold node in a library, a co-op or a village hall is a datacentre the community owns, runs and decides about. Members share the cost. The money pays for local hardware and local people, not distant shareholders.

This matters more now than ever. AI datacentres are arriving in towns that get the noise, the power bills and the water use, while the value and the data flow somewhere else. Infrastructure can be renegotiated over time. Data, once extracted, is gone for good. The answer is not to refuse infrastructure, but to own it.

It is not a new idea. Community networks in Catalonia have grown to tens of thousands of nodes. A neighbourhood in Barcelona runs its own server for email, files and calendars. Rural communities in the UK have built their own local cloud. Freehold is designed so that kind of community can hold its members' data and run their AI too, run by people they know, under rules they agree.

## Open by default

Freehold is open source under the Apache-2.0 licence. The code, the policy language, the design decisions and the reasoning behind them are all public. Anyone can read them, run them, question them or build something better on top.

That openness is the point. A system that asks you to trust it with your context should be one you can inspect. A standard for privacy rules should belong to everyone who uses it, not to whoever wrote it first. And infrastructure meant to outlast any single company cannot depend on one.

Freehold builds on others' work rather than starting from nothing: open AI models, open sync engines, open identity standards and open cryptographic networks. The term Personal Context Infrastructure itself comes from Jad Esber and Apurva Chitnis at koodos, and the thinking behind it was shaped by work presented at MozFest 2025 on reclaiming agency in the context economy.

## Honest about where we are

Freehold is a developer preview. Every layer exists and runs on a developer's machine today: encrypted local storage, a personal AI agent, the S-PAL policy language, policy enforcement, zero-knowledge proofs and self-owned identity. A working demo shows a shop confirming someone is over 21 without learning their birthday.

It is not yet ready for everyday use. Some steps in the demo are simulated on a local test setup. Syncing between your own devices is still being built. There is no ready-made kit for a library or co-op to run a node, and no outside services accept Freehold yet. We would rather say so plainly than promise what does not exist. The status of every part is published on this site and updated as things ship.

## Why now

The tools to keep your own context exist today: capable local models, mature encryption, working zero-knowledge proofs and communities that already run their own infrastructure. What does not exist yet is the habit. The next few years will decide whether personal AI is something you own or something you rent.

If we wait, the default will be set for us.

## Join in

If you care about your own data, follow along, read how it works and tell people about it. Ask the services you use what they do with your context.

If you are part of a library, co-op, club or any group that might host a node, we want to hear from you. The first community nodes should be built with communities, not for them.

If you build software, the code is open and the design decisions are written down. Run it, break it, improve it.

Your data. Your rules. Your community.
