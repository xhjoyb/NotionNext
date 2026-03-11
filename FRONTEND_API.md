# 前端对接文档（Douyin API）

> 本文档面向前端集成使用，按后端路由分类。

## 基础信息
- 服务名称：Douyin 解析 API
- 协议与地址：
  - 本地：`http://127.0.0.1:1314`
  - 线上：使用你的域名或服务器 IP（示例：`http://<server-ip>:1314`）
- 统一前缀：`/v1/douyin`
- 响应格式：JSON

## 通用错误响应
所有接口失败时统一返回：
```json
{
  "success": false,
  "error": "错误信息",
  "error_type": "错误类型"
}
```

### 常见错误类型
- `missing_cookie_file`：服务端缺少 `www.douyin.com_cookies.txt`
- `InvalidShareTextError`：分享文案中未识别到 URL
- `AwemeIdNotFoundError`：无法提取作品 ID
- `WebApiEmptyError`：Web API 返回空数据
- `VideoQualityMissingError`：Web API 未提供质量信息（选“最高质量”失败）

> 说明：`/inspect` 在失败时会尽量回填解析信息（见下方 InspectErrorResponse）。

## 系统接口（System）

### GET /healthz
```json
{ "status": "ok" }
```

## 解析接口（Douyin）

### POST /v1/douyin/resolve
```json
{
  "text": "抖音分享文案或链接"
}
```

**成功响应**（ResolveResponse）：
```json
{
  "success": true,
  "input_text": "...",
  "extracted_url": "从文案提取的 URL",
  "resolved_url": "跳转解析后的 URL",
  "aweme_id": "作品 ID",
  "candidate_urls": ["候选链接1", "候选链接2"]
}
```

**失败响应**（ErrorResponse）：见「通用错误响应」。

---

### POST /v1/douyin/inspect
```json
{
  "text": "抖音分享文案或链接",
  "resource_type": "all",
  "only_best": true
}
```
> `resource_type` 当前固定返回全量最优资源（即使传 video 也会返回音频/封面等）。
> `only_best=true` 时，视频/音频/封面/头像仅返回最优一条；**图文会返回全部图片**。

**测试用例（Windows 一行版）**：
```bash
curl -X POST https://dy-api.joyb.cc/v1/douyin/inspect -H "Content-Type: application/json" -d "{\"text\":\"0.05 复制打开抖音，看看【利里的作品】你相信光吗 # 永远的奥特曼 # 陈洁丽 # 陈洁... https://v.douyin.com/kLAGq36jQVM/ HvF:/ r@E.uF 09/12\",\"resource_type\":\"all\"}"
```

**成功响应**（InspectResponse）：
```json
{
  "success": true,
  "input_text": "...",
  "extracted_url": "...",
  "resolved_url": "...",
  "aweme_id": "...",
  "candidate_urls": ["..."],
  "matched_url": "WEB_API",
  "aweme_type": "note 或 video",
  "content_kind": "note 或 video",
  "selected_resource_type": "all",
  "selected": [
    {"resource_type": "video", "url": "...", "reason": "direct_mp4"},
    {"resource_type": "audio", "url": "...", "reason": "audio"},
    {"resource_type": "cover", "url": "...", "reason": "cover"},
    {"resource_type": "avatar", "url": "...", "reason": "avatar"}
  ],
  "selected_error": null,
  "selected_video_url": "...",
  "selected_video_reason": "direct_mp4 或 play_api",
  "selected_video_quality": {"width": 1080, "height": 1440, "bitrate": 0},
  "max_video_quality": {"width": 1080, "height": 1440, "bitrate": 0},
  "selected_image_urls": ["..."],
  "resources": {
    "direct_mp4": ["..."],
    "play_api": ["..."],
    "dash_video": [],
    "audio": ["..."],
    "image": ["..."],
    "cover": ["..."],
    "avatar": ["..."],
    "unknown_video": []
  },
  "meta": {
    "description": "...",
    "author_name": "...",
    "page_title": null,
    "raw_video_url": "...",
    "video_candidates": ["..."],
    "image_candidates": ["..."],
    "resource_candidate_groups": {"direct_mp4": ["..."], "play_api": ["..."]},
    "cover_url": "...",
    "source_marker": "WEB_API_DETAIL"
  }
}
```

**失败响应**（InspectErrorResponse）：
```json
{
  "success": false,
  "error": "错误信息",
  "error_type": "错误类型",
  "extracted_url": "可能为空",
  "resolved_url": "可能为空",
  "aweme_id": "可能为空",
  "candidate_urls": []
}
```

## 前端接入建议
- **正常业务只调用 `/inspect`**，可直接拿到资源 URL 与质量信息。
- `/resolve` 仅用于预检/排障（例如先拿 aweme_id 入库）。
- `selected_video_quality` 与 `max_video_quality` 来源于抖音 Web API，二者相等表示“最高质量可证明”。
- 图文作品 `content_kind=note`，通常没有视频资源，`selected_image_urls` 会有值。

## 安全与注意事项
- Cookie 文件在服务端维护，前端无需传 Cookie。
- 返回包含大量资源 URL，前端按需挑选并避免泄露。
- 若接口返回 400 且 `error_type=missing_cookie_file`，说明服务端 Cookie 已失效或缺失。
- 若接口返回 429 且 `error_type=rate_limited`，说明触发了限流，请稍后重试。
