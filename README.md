# Accordion

## 使い方

アコーディオンのトリガーに`data-accordion-trigger="<name>"`、中身に`data-accordion-container="<name>"`を HTML の属性として記述する。`<name>` は任意の文字列で、トリガーと中身に同じ値を設定する。

`container`には CSS で`overflow: hidden`, `transition`, `height: 0`を設定しておく。

HTML

```html
<button data-accordion-trigger="sample">trigger</button>
<div
  data-accordion-container="sample"
  style="height: 0; transition: height .6s ease-in-out; overflow:hidden"
>
  container
</div>
```

JavaScript

```javascript
import { init } from '@gorimori/accordion';
init();
```

## 設定

### 最初から開いておく

`container`に`data-accordion-open`（論理属性）を記述する。

```html
<button data-accordion-trigger="sample">trigger</button>
<div
  data-accordion-container="sample"
  data-accordion-open
  style="transition: height .6s ease-in-out; overflow:hidden"
>
  container
</div>
```
