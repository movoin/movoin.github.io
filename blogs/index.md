---
layout: list
---

<div class="wrap-single">
{% for post in site.tags.blog %}
<div class="entry clearfix">
    <h2 class="post-title"><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <p class="post-date"><i class="icon-clock"></i> {{ post.date|date:'%Y-%m-%d' }}</p>
    <div class="post-desc">
        <p>{{ post.description }}</p>
    </div>
</div>
{% endfor %}
<div>
