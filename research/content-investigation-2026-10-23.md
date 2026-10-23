# 玩家内容核查与发布 · 2026-10-23（北京时间）

## 已核查

- 官方 Hub Place 116463962153167 → Universe 10770728771，Roblox Presents 群组 4111519。官方游戏 API 返回活跃玩家数；不等于本人登录实测。
- Hub 徽章 API 全量 9 条、无下一页，五个已发布物品名称及四个幽灵名称存在；描述为空，不据此推导领取条件。
- Roblox 物品 API：Gourdlord 117762017263411、Quack-o'-Lantern 82738816117935，发行者均为 Roblox user 1。IsForSale=false；API PriceInRobux 不是活动 Tickets 价格。
- SharkBlox https://www.youtube.com/watch?v=2r79xI9AW-s：完整字幕；0:08 回 Hub Confirm；0:15–0:31 电影院右柜台；0:39 画面显示 Gourdlord 100 Tickets、Quack 20 + Roblox Plus；0:48–0:56 实际 OWNED 与 40→20 扣款画面。未采用“全部每徽章20”的泛化。
- KAM Gats https://www.youtube.com/watch?v=a1pDpkOCHeA：完整字幕，1:22 Visit Games，1:39 明确 10/20 两种 Ticket 数量；不采纳“10一定更容易”的主观判断。
- WaffleTrades https://www.youtube.com/watch?v=-yFROXeBpVY：完整 5:05 字幕及部分画面。0:09–1:30 五遗物、紫线谜题、钥匙、回电梯；1:42–3:08 Estate/Candy Vault 50门20分钟后回Hub左边领角；3:10–4:15 Flee存100糖、携带30上限、幸存者逃出、Hub右侧领奖。攻略标 REPORTED / video-checked，不声称本人通关。
- SharkBlox https://www.youtube.com/watch?v=iDI6F2XWZ-c：完整1:18字幕，Chapter 3/Halloween Haunted Mansion/单人，15分钟；末尾画面看到库存 Halloween Event 徽章。官方 badge 2355592664430485 描述独立确认15分钟。20 Tickets 来自创作者记录。
- DOORS API 描述明确 Estate/The Hollow；首100徽章中 Sweet Deceit 1035315791189379 明确活动归属，有下一页未遍历。
- Flee 徽章全量9条，无下一页，The Hollow 2026 为1891002643329212、描述空。官方 API 用于身份，不当作糖果步骤来源。

## 不发布为有效结论

- 搜索结果中的 HOLLOW 兑换码属于 Bleach 游戏，不是本活动。官方 Hub、Newsroom和上述实机资料未找到活动码或兑换入口；页面表述为“本次未核实到”，不宣称永远没有。
- Murders vs Sheriffs 视频9EsG93BUh3c只口述15击杀，未完成展示；不列为已核实任务。
- 部分第三方稿把 Hollow Horseman 写成免费，与官方 Marketplace 分类冲突，不采用。
- yt-dlp 字幕请求429，改用原视频页面的公开转录。KAM修复版Day1字幕按钮发生错误导航，没有冒称读完该视频。
- 无实际账号通关、购买Plus、兑换码实测；不把视频核查写成亲测。无固定迷宫转向路线，无重复刷徽章无限Tickets承诺。

## 实现

首页奖励优先：5件物品；奖励页内嵌Tickets获取/入账/兑换/预算/问题检查、活动码状态。新增5个奖励页、4个任务页，可保存至既有进度工具。Hub及跨体验任务使用事件ID作归属，保留九个Nightly Haunts游戏目录的意义。

## 15:37 北京时间后续核查：四种 launcher ghosts

直接读取 economy.roblox.com/v2/assets/{id}/details：Spotlight Specter 133784027835704、Little Plus-tergeist 95891531906747、Phantom in the Code 136331462544974、Incorporeal Incorporated 109977772936626。四项 creator 均为 Roblox user 1；描述分别明确从 Star Creator、Plus subscriber、developer、Roblox admin 的 ghost launcher 捕获。发布此官方身份映射及捕获条件，不推断领取人必须 Plus、不推断成功入库或免费资格。首页站内链接、奖励页独立小节；不混入已核查免费筛选。

SharkBlox 原视频 HTPoidDz6xg 本轮在内置浏览器打开；转录导出不可用，文字转录按钮导航异常，返回显示媒体不可播放。没有声称取得完整字幕或领取画面。网页检索的第三方指南只能作为线索。暂无本轮核实的新活动兑换码或 Night 2 完整任务。

## 17:47 北京时间后续：Hunted Candy Collector

从第三方徽章索引发现 ID 后，直接核验官方 https://badges.roblox.com/v1/badges/1253232809160660：Candy Collector，enabled true，awardingUniverse 7229780065，rootPlaceId 136431686349723。描述给出 event 标签传送门、Trick-or-Treat doors、回主大厅 Ring Alter 领取徽章的流程；同时出现 more than 75 和 75，公开保留歧义。新增官方文字攻略及首页、奖励页站内入口，替换旧“条件未知”说明。不宣称本人实测、不写未核实 Tickets 数量。

Grow a Garden Sweet Fortune 3035855755279266 官方 API 身份可读，但 description null；500糖及具体领取步骤仍未发布。
