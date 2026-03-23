---
layout: post
title: "Learnings from Running Spotify Healthcheck Retros"
date: 2019-11-26 18:40:00 +0000
categories: [Software Engineering]
tags: [software-engineering]
description: "A better way to do retrospectives."
---

> A better way to do retrospectives.

Although Spotify [Squad Health Check](https://labs.spotify.com/2014/09/16/squad-health-check-model/) has been out there for 5 years, I only read about it around a year ago. I was just getting into the whole support structure around autonomous teams, and found it — along with the idea of [Chapters and Tribes](https://blog.crisp.se/wp-content/uploads/2012/11/SpotifyScaling.pdf) — fascinating. Lucky for me, rest of my team was also very open to trying out the new retro format, so I got the chance to run it a few times.

<figure>
    <img src="/assets/img/posts/squad-health-check-model-overview.png"/>
    <figcaption>Spotify Health Check in a nutshell</figcaption>
</figure>

What I Liked
------------

The distinguishing factor of the format, when I read it the first time, was the themes it was built around. I'd taken part in many retros following the [Mad/Sad/Glad format](https://www.retrium.com/resources/techniques/mad-sad-glad), and found they often suffered from [recency effect](https://en.wikipedia.org/wiki/Serial-position_effect#Recency_effect). We often missed discussing important points because we spent so much time focusing on recent events. Also, it was easy for these sessions to be driven by the people who were the most vocal, underrepresenting the quieter people in the room.

> In practice, the priming to themes makes the health check format **powerful**, inclusive and flexible: Its recommended themes are comprehensive for many software development teams, but it also allows you to define your own.

What I Improved
---------------

The blog post on healthcheck seems to focus on the traffic lights and how to decide on them:

> > For each question, the squad is asked to discuss if they are closer to "awesome" or closer to "crappy", and we use basic workshop techniques (dot voting, etc) to help them reach consensus about which color to choose for that indicator...

This didn't feel complete to me. The focus on color consensus felt a lot more about _reporting_ than it felt about helping the team get better. To understand the team's worries, I decided to use the colors as a means to the end, and evolve the session more into a **retrospective**.

<figure>
    <img src="https://miro.medium.com/proxy/0*2GDBl_Q1FdR93maj"/>
    <figcaption>Great, but why red?</figcaption>
</figure>

How It Worked In the End
------------------------

The whole session usually takes around 1.5–2h with a team of 5. Since it's quite time-consuming, we tend to do it every 6 months or so, depending on how often the team finds it useful. Although it's easiest to do when everyone is colocated, it can also be done with remote teams with a bit of prep and a spreadsheet.

For each theme in the health check, we vote with our traffic lights, and note down the result. Afterwards, instead of establishing an end result on the color and the trend, reds and yellows take turns discussing their worries. We then note down actionables for each item, and move to the next theme.

Although the session is over within those 2 hours, the retro isn't really over until a final write-up that we share across the company. We do this both for transparency and so that others can learn from our actionables. We also keep a wiki of past results and write-ups, which we use to establish trends across health checks.

As a last step, we use checkpoints and other retros to revisit the action points, check our progress towards a healthier team, and iterate.

<figure>
    <img src="/assets/img/posts/happy-faces.jpg"/>
    <figcaption>Look at all these happy faces.</figcaption>
</figure>

Final Thoughts
--------------

Although a bit time consuming, I found Spotify Health Checks to be very effective in understanding how we perform as a team. It highlighted issues that had flown under the radar, and enabled us to act on them. I hope that this write-up can convince you to try it out as well.
