# 生产部署

当前入口：`https://134.175.189.189:789/`。`http://134.175.189.189/` 会跳转到该入口；789 端口使用 HTTPS。

服务器目录为 `/opt/ip-studio`。`compose.yaml` 将应用与 Nginx 代理部署为两个独立容器。应用只暴露在 Docker 内网；公网仅开放 789。服务器的 `.env`、`secrets/`、`data/` 和 `certbot/` 不进入镜像或 Git。生产环境关闭新用户注册和模拟支付。

## 运维

- 查看状态：`sudo docker compose --project-directory /opt/ip-studio -f /opt/ip-studio/compose.yaml ps`
- 查看日志：`sudo docker compose --project-directory /opt/ip-studio -f /opt/ip-studio/compose.yaml logs --tail 100 app proxy`
- 重启应用：`sudo docker compose --project-directory /opt/ip-studio -f /opt/ip-studio/compose.yaml restart app`
- 管理员初始登录信息仅保存在服务器 `/opt/ip-studio/secrets/admin-initial.txt`，权限为 `0600`；不要复制进 Git 或镜像。

## 数据和证书

SQLite 数据库与图片在 `/opt/ip-studio/data`。`ip-studio-backup.timer` 每天 02:00 运行，保留最近 14 份同机快照于 `/opt/ip-studio/backups`。同机快照不能替代异地备份。

Let's Encrypt 的 IP 证书有效期约六天。`ip-studio-cert-renew.timer` 每天 03:15 检查续签，成功后重载本项目代理。HTTP 验证规则是现有公网 Nginx 的 `/opt/dify/docker/nginx/conf.d/ip-studio-acme.conf`，只匹配该 IP。续签已通过 `renew --dry-run` 演练。

此地址目前公网可达。若要保证云服务器更换或释放后 IP 仍归你所有，需在云厂商控制台确认 `134.175.189.189` 是已绑定的弹性公网 IP；服务器内无法核实该资源类型。
