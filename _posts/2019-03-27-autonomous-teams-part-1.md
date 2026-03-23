---
layout: post
title: "Autonomous Teams, Part 1: Do They Scale?"
date: 2019-03-27 18:40:00 +0000
categories: [Software Engineering]
tags: [software-engineering, agile]
description: "Verdict: They're initially fine, but they won't scale fine if you're not careful."
---

> Verdict: They're initially fine, but they won't scale fine if you're not careful.

Autonomous teams (or two pizza teams, as popularised by Jeff Bezos) have become an industry standard, especially within startups. It's easy to understand why: They optimise the time-to-impact of a team. They make it easy to go from idea to product with minimal fuss. They empower all team members to drive a shared vision together. Compare this to a process driven top-down model: By the time you actually invest into validating an idea, you will have made so much investment into building processes you may not even need. Why bother, when all you should care about at this stage is validating your idea and creating value?

The above is nothing new, it's been the general advice for a long time. So you decide to build your startup following this recipe for success, just like all the others.

<figure>
    <img src="/assets/img/posts/ravioli.jpg" alt="Ravioli neatly arranged"/>
    <figcaption>Your team at the beginning. Delicious.</figcaption>
</figure>

Fast-forward 5 years. You've now established your share in the market (hell, maybe you're a unicorn, in which case, congrats!). Your team of 2 is now your team of 500, within 60 teams, in 2–3 different locations. Suddenly there's a bit of chaos everywhere. Tech debt has racked up, you know you need to address it somehow, but no team wants to own it. Some areas of your product have fallen through the cracks of teams switching focus, and are now unowned. Those 60 teams all have their own visions on what will have the most customer impact. Most of those projects require help from, or touch parts owned by, other teams, who all have different priorities.

You thought autonomous teams would never hit any of these issues, and yet here you are, scratching your head.

<figure>
    <img src="/assets/img/posts/spaghetti.jpg" alt="Tangled spaghetti"/>
    <figcaption>Your team now. <a href="https://cacm.acm.org/system/assets/0003/2596/092018_CACMpg27_The-Obscene-Coupling.large.jpg?1537466263&1537466263">Needs some sauce.</a></figcaption>
</figure>

See, this is the trade-off you implicitly made when you opted to not impose a top-down hierarchy. On a top-down scenario, the solution is relatively simple: Convince the people at the top that project X needs to be prioritised over project Y, and the tech debt poses as a significant threat to growth. All it takes is convincing 2–3 people. Those people may be hard to reach, but they're there, and where they lead, people _have to_ follow. In an autonomous team structure, you have no power to tell anyone to own anything (and for good reason). You need buy-in from all the 10 teams that need to help you ship this new _Thing._ How do you get that buy-in?

* * *

How do you scale this autonomous team structure?
------------------------------------------------

This is an inherently hard problem. That doesn't mean it's the end of the autonomous team model though. It's just an evolution of it.

To come up with a solution, let's look at what blocks us from scaling in the scenario above. What's the common theme?

> >
> > Some areas of your product have fallen through the cracks of teams switching focus
> >
> > 60 teams, in 2–3 different locations
> >
> > no team wants to own it
> >
> > 60 teams all have their own visions

**The problem isn't the people, it's not the numbers, it's the interactions. You're solving for better communication highways.**

That is exactly what a top-down setup has that you don't. Comms highways in top-down setups are clear. With autonomous teams, it's far from it.

So, what can we do to have better comms in our organisation?

In a cruel twist of fate, the clue to solving this lies in turning Conway's Law on its head.

> Organizations which design systems … are constrained to produce designs which are copies of the communication structures of these organizations.

Instead of looking at the organisation you have, let's look at the technical architecture you're working towards adopting. How does your microservices design look nowadays? If it follows the latest developments, it likely is going towards a setup where the communication layer is separated into a [service mesh](https://www.thoughtworks.com/radar/techniques/service-mesh) concept. Service mesh allows you to abstract away communication concerns to be handled by specific tools, so that all you need to worry about is your service doing its business logic. Service mesh acts as the nervous system to your evolving microservice organism.

Working backward from your microservices to the organization that built them, perhaps the answer for having better cross-team communication flows is to abstract it away as a separate responsibility as well.

_But wait, isn't that just hierarchy? Where managers have the responsibility for communication and decision-making, and developers just get given tasks to finish?_

No, but close. The answer lies in turning the top-down model on its head as well. What you're looking at is a **bottom-up, enabler** culture.

Leads, leads of leads, and VPs should be the communication highways. Their responsibility should be to absorb information from different contexts, bring that knowledge to their teams when planning/prioritising, and be point of contact when it comes to moving bigger, cross-team needles. Their primary goal should be to help you achieve your best work. More importantly, they need to have those discussions **in public forums, not in private circles.** Unless conversations are happening in public forums, you'll only feel like you're another cog in a machine. The power of enabler culture comes from the transparency and accountability of leads to their (in)direct reports — aka their customers.

If you're wondering whether your company truly adopts a bottom-up culture, ask yourself this: Do the people "higher up" in titles ask me for feedback, and treat that feedback the same way they treat feedback from their equals? Can I hold them accountable publicly for their actions? Do they openly discuss retros of cross-team initiatives gone wrong? Do they drive those initiatives, or do they only advise and help on collaboration, leaving the vision and execution to me? Answers to those may help identify whether your leads are managers or enablers.

How do you organise public forums that act like communication highways? Again, not a solved problem, but a "council of elders" setup can help get there. The role of these councils should be to provide a forum in which people can come for advice, as well as be accountable for the question of "Where do we want to be in 6 months/2 years/5 years, to be able to enable our people to serve our customers in the best way?". These could be formed for any slice of your company, whether it's product, tech, recruitment, culture, or others. In engineering, some examples for slices could be your API, critical domain architecture, and tech stack. In product, these could be your product pillars. In case you're looking at inspiration for some other candidates, I'd recommend having a look at your product/engineering/recruitment/culture values and vision for a starting point.

* * *

Conclusion
----------

Most problems are people problems, and autonomous teams have a lot of empowered people. As long as you trust them, and give them a nervous system they can use to transmit knowledge across the company, you'll get there. Autonomous teams are fine — although things may very occasionally be on fire.
