export const config = { runtime: "edge" };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const mid = searchParams.get("mid");
  const uid = searchParams.get("uid");

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  const weiboHeaders = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Referer": "https://m.weibo.cn/",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
  };

  try {
    if (mid) {
      const r = await fetch(`https://m.weibo.cn/statuses/show?id=${mid}`, { headers: weiboHeaders });
      const text = await r.text();
      return new Response(text, { headers });
    }

    if (uid) {
      const r = await fetch(`https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}`, { headers: weiboHeaders });
      const data = await r.json();
      const user = data?.data?.userInfo;
      if (!user) return new Response(JSON.stringify({ error: "找不到该用户" }), { status: 404, headers });
      return new Response(JSON.stringify({
        name: user.screen_name || "",
        description: user.description || "",
      }), { headers });
    }

    return new Response(JSON.stringify({ error: "缺少参数 mid 或 uid" }), { status: 400, headers });

  } catch(e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
