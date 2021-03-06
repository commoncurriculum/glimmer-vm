import { Reference } from '@glimmer/reference';
import { Tag } from '@glimmer/validator';
import { Option } from '@glimmer/util';

import { combineTagged } from '../utils/tags';
import { normalizeStringValue } from '../dom/normalize';

export default class ClassListReference implements Reference<Option<string>> {
  public tag: Tag;

  constructor(private list: Reference<unknown>[]) {
    this.tag = combineTagged(list);
    this.list = list;
  }

  value(): Option<string> {
    let ret: string[] = [];
    let { list } = this;

    for (let i = 0; i < list.length; i++) {
      let value = normalizeStringValue(list[i].value());
      if (value) ret.push(value);
    }

    return ret.length === 0 ? null : ret.join(' ');
  }
}
