import i18n from "../../../../utils/i18n";

export class User {
  public d: {
    id: number;
    name: string;
    brand: string;
    level: number;
    type: number;
    block: boolean;
    mute: boolean;
  };

  constructor(data: unknown) {
    this.parse(data);
  }

  public parse(d: any) {
    const giveBasicInfo = (obj: any) => {
      this.d = {
        ...this.d,
        id: obj.user_id,
        name: obj.name,
      };
    };

    if (d.extra) {
      if (d.extra.user) {
        giveBasicInfo(d.extra.user);
      }
      if (d.extra.im_discipulus_info) {
        this.d = {
          ...this.d,
          level: parseInt(d.extra.im_discipulus_info.level, 10),
          brand: d.extra.im_discipulus_info.discipulus_group_title,
        };
      }
      if (d.extra.user_room_auth_status) {
        this.d = {
          ...this.d,
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
    if (!this.d.type) {
      this.d.type = 0;
    }
  }

  public toString() {
    if (this.d.level === 0) {
      return `${() => {
        return {
          1: `[${i18n.room.operator}]`,
          3: `[${i18n.room.streamer}]`,
        }[this.d.type];
      }}${this.d.name}`;
    }
  }

  public [Symbol.toPrimitive]() {
    return this.d;
  }
}
