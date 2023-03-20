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
