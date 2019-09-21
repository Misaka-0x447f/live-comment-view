import i18n from "../../../../utils/i18n";

export const toUser = (d: any) => {
  let r: Partial<{
    id: number;
    name: string;
    brand: string;
    level: number;
    type: number;
    block: boolean;
    mute: boolean;
  }> = {};

  const giveBasicInfo = (obj: any) => {
    r = {
      ...r,
      id: obj.user_id,
      name: obj.name,
    };
  };

  if (d.extra) {
    if (d.extra.user) {
      giveBasicInfo(d.extra.user);
    }
    if (d.extra.im_discipulus_info) {
      r = {
        ...r,
        level: parseInt(d.extra.im_discipulus_info.level, 10),
        brand: d.extra.im_discipulus_info.discipulus_group_title,
      };
    }
    if (d.extra.user_room_auth_status) {
      r = {
        ...r,
        type: d.extra.user_room_auth_status.user_type,
        block: d.extra.user_room_auth_status.is_block,
        mute: d.extra.user_room_auth_status.is_silence,
      };
    }
  } else if (d.room) {
    if (d.room.user_info) {
      giveBasicInfo(d.room.user_info);
    }
  } else if (d.anchor) {
    if (d.anchor.user_info) {
      giveBasicInfo(d.anchor.user_info);
    }
  }
  if (!r.type) {
    r.type = 0;
  }

  const toString = () => {
    if (r.level === 0) {
      return `${() => {
        return {
          1: `[${i18n.room.operator}]`,
          3: `[${i18n.room.streamer}]`,
        }[r.type];
      }}${r.name}`;
    }
  };

  return {
    ...r,
    plainText: toString(),
  };
};
