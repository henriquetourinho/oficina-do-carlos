with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('group media-thumbnail""', 'group media-thumbnail"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Quotes fixed")
