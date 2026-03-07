export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { mid, uid } = req.query;
  try {
    if (mid) {
      const r = await fetch(`https://m.weibo.cn/statuses/show?id=${mid}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
          "Referer": "https://m.weibo.cn/"
        }
      });
      return res.status(200).json(await r.json());
    }
    if (uid) {
      const r = await fetch(`https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
          "Referer": "https://m.weibo.cn/"
        }
      });
      const data = await r.json();
      const user = data?.data?.userInfo;
      if (!user) return res.status(404).json({ error: "找不到该用户" });
      return res.status(200).json({ name: user.screen_name||"", description: user.description||"" });
    }
    res.status(400).json({ error: "缺少参数" });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
