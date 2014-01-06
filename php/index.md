---
layout: list
---

{% for post in site.categories.php %}
<div class="entry clearfix">
    <h2 class="entry-title"><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <cite class="entry-date"><i class="icon-clock"></i> {{ post.date|date:'%Y-%m-%d' }}</cite>
    <div class="entry-cnt">
        <p>{{ post.description }}</p>
    </div>
</div>
{% endfor %}
