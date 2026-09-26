# plaincode.work

plaincode（屋号）の公式サイト。フレームワークなしの静的 HTML 1枚。

- 公開URL: https://plaincode.work
- ホスティング: Vercel（プロジェクト名 `plaincode`）
- DNS / レジストラ: Cloudflare
- 更新方法: `index.html` を編集して `main` に push すると自動デプロイ

## ファイル

- `index.html` — 本文・スタイル（インライン）
- `favicon.svg` — アイコン
- `og.png` — SNS シェア画像（1200×630）
- `robots.txt` / `sitemap.xml`
- `vercel.json` — セキュリティヘッダー・URL 正規化

## お問い合わせフォーム

- `api/contact.js` が Resend 経由で `masayasusuzuki@plaincode.work` にメール送信する（送信元 `notify@plaincode.work`）
- 環境変数 `RESEND_API_KEY` が Vercel に必要。未設定だと API は 503 を返し、画面はメールリンクにフォールバックする
- 登録コマンド（このディレクトリで）: `vercel env add RESEND_API_KEY production` → キーを貼り付け → `vercel deploy --prod --yes`
