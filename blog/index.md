---
layout: list
---

<div class="entry-list">
{% for post in site.posts %}
  <div class="entry">
    <h2 class="entry-title"><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <div class="entry-meta">
      <div class="entry-date">
        Written by <span>{{ site.author }}</span> on <small>{{ post.date | date:'%Y/%m/%d' }}</small>
      </div>
      <div class="entry-tags">
        <span>Tags:</span>
      {% for tag in post.tags %}
        <a href="javascript:void(0)" class="tag">{{ tag }}</a>
      {% endfor %}
      </div>
    </div>
    <div class="entry-desc">
      <p>{{ post.description }}</p>
    </div>
  </div>
{% endfor %}
<div>
