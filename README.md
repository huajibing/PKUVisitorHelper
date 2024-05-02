# PKUVisitorHelper
PKU学生访客预约自动填表插件
# Usage
1. 把autoFiller.js导入TamperMonkey；
2. 访问https://simso.pku.edu.cn/pages/sadEpiVisitorAppt.html，在填表页面点击“自动填充设置”；
3. 填写信息，值得注意的是：
   - “预约人联系电话序号”与“预约人联系电话”中的选项相对应，此处填写其序号（如1）
   - “预约入校日期”中的第一天、第二天和第三天对应今天、明天、后天。
4. 点击“保存档案”；
5. 开启“自动填充”。  
刷新页面后，会根据保存的信息自动填写申请。
