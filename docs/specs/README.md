# Specs

## User Data

- [ ] 用户可以绑定多个 SNS 账号
- [ ] 如果用户没有绑定 SNS 账号，那么他可以和公开的 AIer 进行交流

user.accounts.twitter

```ts
-- 这是 NoSQL 的数据结构
interface user {
    accounts: {
        twitter: {
            id: string,
            username: string,
            name: string,
            profileImage: string,
            accessToken: string,
            accessTokenSecret: string
        }
    }
}
```

```sql
-- RDB 的数据结构
CREATE TABLE sns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    user_id references auth.users
);
```

## Sync Tweets via RSSHub

RSS Feed Read

```json
{
  "creator": "AIer",
  "title": "You can use #AIer as your Next-generation #PKM, which has several innovations: 1. Asking instead of keyword retrieval. AIer uses #GPT to understand qu...",
  "link": "https://twitter.com/AIerdotapp/status/1645270406012755968",
  "pubDate": "Mon, 10 Apr 2023 03:40:07 GMT",
  "author": "AIer",
  "content": "You can use #AIer as your Next-generation #PKM, which has several innovations:<br><br>1. Asking instead of keyword retrieval. <br><br>AIer uses #GPT to understand qustions, so we can ask more accurate questions instead of simply combining multiple keywords.<br><br>New 🆚 Old https://t.co/18lPlBM4Eh<br><img style=\"\" src=\"https://pbs.twimg.com/media/FtUovz3acAAc59i?format=png&amp;name=orig\" referrerpolicy=\"no-referrer\"><br><img style=\"\" src=\"https://pbs.twimg.com/media/FtUpkRHaUAEzn70?format=png&amp;name=orig\" referrerpolicy=\"no-referrer\">",
  "contentSnippet": "You can use #AIer as your Next-generation #PKM, which has several innovations:\n1. Asking instead of keyword retrieval. \nAIer uses #GPT to understand qustions, so we can ask more accurate questions instead of simply combining multiple keywords.\nNew 🆚 Old https://t.co/18lPlBM4Eh",
  "guid": "https://twitter.com/AIerdotapp/status/1645270406012755968",
  "isoDate": "2023-04-10T03:40:07.000Z",
  "latestRead": "2021-06-01"
}
```

```
content: {{ json.contentSnippet }}
created_at: {{ json.link }}
source_url: {{ json.isoDate }}
```
