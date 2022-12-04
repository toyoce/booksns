## booksns
Next.jsの練習として作成した、本のレビューを投稿・閲覧するアプリケーション。

Flaskで作成したバックエンドのREST APIと協調して動作する。バックエンド用のリポジトリは[こちら](https://github.com/toyoce/booksns-api)。

### 機能一覧
- 本の検索
- レビューの閲覧
- アカウント作成、ログイン
- レビューの投稿、編集、削除
- 他のユーザーのレビューへのいいねの付与、削除
- アバター画像の登録、更新

### 使用技術・ライブラリ
- Next.js
- MUI
- react-toastify

### 起動方法
`.env.local`を作成し、環境変数の値を設定
```bash
$ cp .env.example .env.local
```

依存ライブラリをインストール 
```bash
$ npm install
```

起動 (※別途バックエンドの起動が必要)
```bash
$ npm run dev
```
