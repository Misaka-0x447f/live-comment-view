# coding=utf-8
import json
import sys

from Struct.MemberMsg import MemberMsg
from Struct.User import User
from Struct.Gift import Gift
from Struct.Chat import Chat
from Struct.Danmaku import Danmaku
from Struct.Lottery import Lottery
import requests
import time

s = requests.Session()

DEBUG = False


class XiGuaLiveApi:
    isLive = False
    isValidRoom = False
    _rawRoomInfo = {}
    name = ""
    roomID = 0
    roomTitle = ""
    roomLiver = None
    roomPopularity = 0
    _cursor = "0"
    _updRoomCount = 0
    lottery = None

    def __init__(self, name: str = "宝蓝狼"):
        """
        Api类
        Init Function
        :param name: 主播名
        """
        self.name = name
        self.updRoomInfo()

    def _updateRoomPopularity(self, _data):
        """
        更新房间人气的方法
        Update Room Popularity
        :param _data: Received Message
        """
        if "extra" in _data:
            if "member_count" in _data["extra"] and _data["extra"]["member_count"] > 0:
                self.roomPopularity = _data["extra"]["member_count"]
        elif "data" in _data:
            if "popularity" in _data["data"]:
                self.roomPopularity = _data["data"]["popularity"]

    @staticmethod
    def apiChangedError(msg: str, *args):
        """
        API发生更改时的提示
        Warning while Detected Api has Changed
        :param msg: 提示信息
        :param args: DEBUG模式下，显示更多信息
        """
        print(msg)
        if DEBUG:
            print(*args)

    def onPresent(self, gift: Gift):
        """
        礼物连击中的消息
        Message On Sending Presents
        :param gift: Struct of Gift Message
        """
        print("礼物连击 :", gift)

    def onPresentEnd(self, gift: Gift):
        """
        礼物送完了的提示信息
        Message On Finished Send Present
        :param gift: Struct of Gift Message
        """
        print("感谢", gift)

    def onAd(self, i):
        """
        全局广播
        All Channel Broadcasting Message( Just An Ad )
        :param i: JSON DATA if you wanna using it
        """
        # print(i)
        pass

    def onChat(self, chat: Chat):
        """
        聊天信息
        On Chatting
        :param chat: Struct of Chat Message
        """
        if not chat.isFiltered:
            print(chat)
            
    def onDanmaku(self, danmaku: Danmaku):
        """
        弹幕
        On onDanmaku
        """
        print(danmaku)

    def onEnter(self, msg: MemberMsg):
        """
        进入房间消息
        On Entering Room
        :param msg: Struct of Member Message
        """
        print("提示 :", msg)

    def onSubscribe(self, user: User):
        """
        关注主播时的消息
        On Subscribe
        :param user: Struct of User Message
        """
        print("消息 :", user, "关注了主播")

    def onJoin(self, user: User):
        print("欢迎", user, "加入了粉丝团")

    def onMessage(self, msg: str):
        print("消息 :", msg)

    def onLike(self, user: User):
        print("用户", user, "点了喜欢")

    def onLeave(self, json: any):
        """
        下播消息
        On Liver Leave
        :param json:
        """
        print("消息 :", "主播离开了")
        self.updRoomInfo()

    def onLottery(self, i:Lottery):
        """
        中奖的内容
        :param i:
        """
        print("中奖消息 :", i)

    def _checkUsernameIsMatched(self):
        """
        验证主播名字是自己想要的那个
        Check name matched
        :return: bool: 是否匹配
        """
        if self.name is None or self.roomLiver is None:
            return False
        return True

    def _forceSearchUser(self):
        """
        搜索主播名
        :return:
        """
        try:
            p = s.get("https://security.snssdk.com/video/app/search/live/?version_code=730&device_platform=android"
                      "&format=json&keyword={}".format(self.name))
            d = p.json()
        except json.decoder.JSONDecodeError as e:
            self.apiChangedError("搜索接口错误", e.__str__())
            return
        if "data" in d and d["data"] is not None:
            for i in d["data"]:
                if i["block_type"] != 0:
                    continue
                if "cells" not in i or len(i["cells"]) == 0:
                    return
                self.isValidRoom = True
                if "is_living" in i["cells"][0]["anchor"]["user_info"]:
                    self.isLive = i["cells"][0]["anchor"]["user_info"]["is_living"]
                else:
                    self.isLive = False
                if "room_id" in i["cells"][0]["anchor"]:
                    self.roomID = int(i["cells"][0]["anchor"]["room_id"])
                else:
                    self.isLive = False
                self.roomLiver = User(i["cells"][0])
        if self.isLive:
            return self._updateRoomOnly()
        else:
            return False

    def _updateRoomOnly(self):
        """
        仅更新房间，不重新获取信息
        :return:
        """
        try:
            p = s.post("https://i.snssdk.com/videolive/room/enter?version_code=730"
                       "&device_platform=android",
                       data="room_id={roomID}&version_code=730"
                            "&device_platform=android".format(roomID=self.roomID),
                       headers={"Content-Type": "application/x-www-form-urlencoded"})
            d = p.json()
        except Exception as e:
            self.apiChangedError("更新房间接口错误", e.__str__())
            return False
        self.isValidRoom = d["base_resp"]["status_code"] == 0
        if d["base_resp"]["status_code"] != 0:
            self.apiChangedError("更新房间信息接口返回非0状态值", d)
            return False
        if "room" not in d and d["room"] is None:
            self.apiChangedError("Api发生改变，请及时联系我", d)
            return False
        self.roomLiver = User(d)
        if not self._checkUsernameIsMatched():
            self.isLive = False
            return False
        self._rawRoomInfo = d["room"]
        self.isLive = d["room"]["status"] == 2
        self.roomTitle = d["room"]["title"]
        self.roomPopularity = d["room"]["user_count"]
        l = Lottery(d)
        if l.isActive:
            self.lottery = l
        return True

    def updRoomInfo(self):
        """
        更新房间信息
        :return:
        """
        if self.isLive:
            return self._updateRoomOnly()
        else:
            return self._forceSearchUser()

    @staticmethod
    def findRoomByUserId(userId:int):
        """
        通过UserId查找用户的房间号(已弃用)
        :param userId: 用户ID
        :return: XiGuaLiveApi
        """
        p = s.get("https://live.ixigua.com/api/room?anchorId={room}".format(room=userId))
        if DEBUG:
            print(p.text)
        d = p.json()
        if "data" not in d or "title" not in d["data"] or "id" not in d["data"]:
            XiGuaLiveApi.apiChangedError("网页接口已更改，除非你是开发者，请不要用这个方法", d)
            return XiGuaLiveApi()
        return XiGuaLiveApi(d["data"]["id"])

    @staticmethod
    def searchLive(keyword):
        """
        通过关键词搜索主播
        :param keyword: 关键词
        :return: array: 搜索结果
        """
        ret = []
        p = s.get("https://security.snssdk.com/video/app/search/live/?version_code=730&device_platform=android"
                  "&format=json&keyword={}".format(keyword))
        d = p.json()
        if "data" in d:
            for i in d["data"]:
                if i["block_type"] == 0:
                    for _i in i["cells"]:
                        ret.append(_i["room"])
        return ret

    def getDanmaku(self):
        """
        获取弹幕
        """
        if not self.isValidRoom:
            self.updRoomInfo()
            return
        p = s.get("https://i.snssdk.com/videolive/im/get_msg?cursor={cursor}&room_id={roomID}"
                  "&version_code=730&device_platform=android".format(
                      roomID=self.roomID,
                      cursor=self._cursor
                  ))
        d = p.json()
        if "data" not in d or "extra" not in d or "cursor" not in d["extra"]:
            if "base_resp" in d and d["base_resp"]["status_code"] != 10038:
                print(d["base_resp"]["status_message"])
                self.apiChangedError("接口数据返回错误", d)
            return
        else:
            self._cursor = d["extra"]["cursor"]
            if DEBUG:
                print("Cursor:\t", self._cursor)
        for i in d['data']:
            if DEBUG:
                print(i)
            if "common" not in i and "method" not in i["common"]:
                continue
            if i["common"]['method'] == "VideoLivePresentMessage":
                self.onPresent(Gift(i))
            elif i["common"]['method'] == "VideoLivePresentEndTipMessage":
                self.onPresentEnd(Gift(i))
            elif i["common"]['method'] == "VideoLiveRoomAdMessage":
                self.onAd(i)
            elif i["common"]['method'] == "VideoLiveChatMessage":
                self.onChat(Chat(i, self.lottery))
            elif i["common"]['method'] == "VideoLiveMemberMessage":
                self.onEnter(MemberMsg(i))
                self._updateRoomPopularity(i)
            elif i["common"]['method'] == "VideoLiveSocialMessage":
                self.onSubscribe(User(i))
            elif i["common"]['method'] == "VideoLiveJoinDiscipulusMessage":
                self.onJoin(User(i))
            elif i["common"]['method'] == "VideoLiveControlMessage":
                print("消息：", "主播离开一小会")
                # 这个消息代表主播下播了，直接更新房间信息
                self.updRoomInfo()
            elif i["common"]['method'] == "VideoLiveDiggMessage":
                self.onLike(User(i))
            elif i["common"]['method'] == "VideoLiveNoticeMessage":
                # 系统消息
                pass
            elif i["common"]['method'] == "VideoLiveDanmakuMessage":
                # 尊贵的弹幕玩家
                self.onDanmaku(Danmaku(i))
                pass
            else:
                print("未知的方法:",i["common"]['method'])
            if self.lottery is None or self.lottery.ID == 0:
                self.lottery = Lottery(i)
        self._updRoomCount += 1
        # 更新抽奖信息
        if self.lottery is not None and self.lottery.ID != 0:
            self.lottery.update()
            if self.lottery.isFinished:
                self.onLottery(self.lottery)
                self.lottery = None
        # 2分钟自动更新下房间信息
        if self._updRoomCount > 120 or len(d['data']) == 0:
            self.updRoomInfo()
            self._updRoomCount = 0
            return


if __name__ == "__main__":
    name = "宝蓝狼"
    if len(sys.argv) > 2:
        if sys.argv[-1] == "d":
            DEBUG = True
        name = sys.argv[1]
    print("西瓜直播弹幕助手 by JerryYan")
    api = XiGuaLiveApi(name)
    if not api.isValidRoom:
        input("房间不存在")
        sys.exit()
    print("进入", api.roomLiver, "的直播间")
    print("=" * 30)
    while True:
        if api.isLive:
            try:
                api.getDanmaku()
            except requests.exceptions.BaseHTTPError:
                print("网络错误，请确认网络")
                time.sleep(5)
            except Exception as e:
                print(e)
            time.sleep(1)
        else:
            print("主播未开播，等待1分钟后重试")
            time.sleep(60)
            api.updRoomInfo()
